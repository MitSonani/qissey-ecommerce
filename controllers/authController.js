import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// In-memory store for OTPs. In production, use Redis.
export const otpStore = new Map();

export const sendOtp = async (req, res) => {
    try {
        let { phone, name, email, action } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        let standardizedPhone = phone;
        if (standardizedPhone.length === 10) {
            standardizedPhone = '+91' + standardizedPhone;
        } else if (!standardizedPhone.startsWith('+')) {
            standardizedPhone = '+' + standardizedPhone;
        }

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase credentials missing');
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // Check if user exists in public.users
        let { data: user, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('phone', standardizedPhone)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError);
            throw new Error('Database error while checking user');
        }

        if (action === 'login') {
            if (!user) {
                return res.status(404).json({ error: 'User not found. Please register first.' });
            }
        } else if (action === 'register') {
            if (user) {
                return res.status(400).json({ error: 'User already exists. Please log in.' });
            }
            // User will be registered during verify-otp
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if user variable exists (in case the DB code above is commented out)
        const currentUserId = typeof user !== 'undefined' && user ? user.id : standardizedPhone;

        // Store OTP in memory
        otpStore.set(standardizedPhone, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            userId: currentUserId,
            action: action,
            name: name,
            email: email
        });

        // Send OTP via MSG91 WhatsApp API
        const authKey = process.env.MSG91_AUTH_KEY?.trim();

        if (!authKey) {
            console.warn('MSG91_AUTH_KEY missing. OTP generated but not sent via API:', otp);
        } else {
            const formattedPhone = standardizedPhone.startsWith('+') ? standardizedPhone.slice(1) : "91" + standardizedPhone;

            const msg91Url = 'https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/';
            const payload = {
                "integrated_number": "917862930732",
                "content_type": "template",
                "payload": {
                    "messaging_product": "whatsapp",
                    "type": "template",
                    "template": {
                        "name": "otp_verification",
                        "language": {
                            "code": "en",
                            "policy": "deterministic"
                        },
                        "namespace": "7cee7a2e_9f53_4838_bb70_c965c7d57e75",
                        "to_and_components": [
                            {
                                "to": [
                                    formattedPhone
                                ],
                                "components": {
                                    "body_1": {
                                        "type": "text",
                                        "value": otp
                                    },
                                    "button_1": {
                                        "subtype": "url",
                                        "type": "text",
                                        "value": otp
                                    }
                                }
                            }
                        ]
                    }
                }
            };

            const response = await fetch(msg91Url, {
                method: 'POST',
                headers: {
                    'authkey': authKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log("MSG91 response status:", response.status);

            const data = await response.json();
            console.log("MSG91 response data:", data);

            if (data.hasError || data.type === 'error' || (data.status === 'error')) {
                console.error('MSG91 WhatsApp API Error:', data);
                if (data.apiError === '418') {
                    console.error('\n💡 TIP: MSG91 Error 418 means IP Whitelisting is enabled.');
                    console.error('To fix this, go to your MSG91 dashboard -> Authkey settings and whitelist your server IP.');
                    console.error('Or, you can temporarily disable IP security for this Authkey.\n');
                }
                console.warn('Failed to send WhatsApp OTP:', data);
            }
        }
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ error: 'Phone and OTP are required' });
        }

        let standardizedPhone = phone;
        if (standardizedPhone.length === 10) {
            standardizedPhone = '+91' + standardizedPhone;
        } else if (!standardizedPhone.startsWith('+')) {
            standardizedPhone = '+' + standardizedPhone;
        }

        const storedData = otpStore.get(standardizedPhone);

        if (!storedData) {
            return res.status(400).json({ error: 'No OTP requested or OTP expired' });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(standardizedPhone);
            return res.status(400).json({ error: 'OTP has expired' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        let finalUserId = storedData.userId;

        if (storedData.action === 'register') {
            const { data: newUser, error: insertError } = await supabaseAdmin
                .from('users')
                .insert([{ phone: standardizedPhone, name: storedData.name || 'User', email: storedData.email }])
                .select()
                .single();

            if (insertError) {
                console.error('Error creating user after OTP verification:', insertError);
                return res.status(500).json({ error: 'Failed to create user account. Check database schema/RLS.' });
            }
            finalUserId = newUser.id;
        }

        const jwtSecret = process.env.SUPABASE_JWT_SECRET;

        if (!jwtSecret) {
            throw new Error('SUPABASE_JWT_SECRET is not configured on the server');
        }

        const token = jwt.sign(
            {
                role: 'authenticated',
                sub: finalUserId,
                phone: standardizedPhone
            },
            jwtSecret,
            { expiresIn: '30d' }
        );

        otpStore.delete(standardizedPhone);

        res.status(200).json({
            success: true,
            session: {
                access_token: token,
                user: {
                    id: finalUserId,
                    phone: standardizedPhone
                }
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: error.message });
    }
};


export const verifyUser = async (req, res) => {
    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);



        const { token } = req.body;
        const decodedToken = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

        const userId = decodedToken.sub;
        const { data: user, error } = await supabaseAdmin.from('users').select('*').eq('id', userId).single();
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ user });


    } catch (error) {

    }
}
