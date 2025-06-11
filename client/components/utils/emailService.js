
import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICEID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLICID;

export const sendEmail = async ({
  title,
  user_name,
  actionType,
  custom_message,
  ctaText,
  ctaLink,
  name,
  email,
  from_email,
}) => {
  try {
    const templateParams = {
      name,
      email,
      from_email,
      title,
      user_name,
      action_type: actionType,
      custom_message: custom_message,
      cta_text: ctaText,
      cta_link: ctaLink,
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    return result;
  } catch (error) {
    console.error("EmailJS error:", error);
    throw error;
  }
};
