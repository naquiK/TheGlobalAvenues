const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax';
export const CONTACT_FORM_RECIPIENT_EMAIL = 'tprashant76640@gmail.com';

const normalizeText = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).trim();
};

export const submitContactForm = async ({
  toEmail,
  formName = 'Contact Form',
  source = '',
  fields = {},
}) => {
  const recipient = normalizeText(toEmail) || CONTACT_FORM_RECIPIENT_EMAIL;
  if (!recipient) {
    throw new Error('Missing recipient email for contact form submission.');
  }

  const normalizedFields = Object.entries(fields).reduce((accumulator, [key, value]) => {
    const normalizedValue = normalizeText(value);
    if (normalizedValue) {
      accumulator[key] = normalizedValue;
    }
    return accumulator;
  }, {});

  const subject = `[TGA] ${formName} submission`;
  const payload = {
    _subject: subject,
    _template: 'table',
    _captcha: 'false',
    _form_name: formName,
    _source: normalizeText(source) || (typeof window !== 'undefined' ? window.location.href : ''),
    _submitted_at: new Date().toISOString(),
    _replyto: normalizeText(fields.email),
    ...normalizedFields,
  };

  const response = await fetch(`${FORMSUBMIT_ENDPOINT}/${encodeURIComponent(recipient)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let responseData = null;
  try {
    responseData = await response.json();
  } catch (error) {
    responseData = null;
  }

  const isSuccess = Boolean(
    response.ok && (responseData?.success === 'true' || responseData?.success === true)
  );
  if (!isSuccess) {
    throw new Error(responseData?.message || 'Unable to submit form right now.');
  }

  return responseData;
};
