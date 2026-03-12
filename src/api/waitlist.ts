interface WaitlistSubmission {
  product: string;
  name: string;
  email: string;
  interest?: string;
}

export async function submitToWaitlist(data: WaitlistSubmission): Promise<boolean> {
  try {
    const response = await fetch('/.netlify/functions/submit-waitlist-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    return false;
  }
}
