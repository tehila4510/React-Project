const BASE_URL = 'https://localhost:7185/api';

export async function askChatTeacher(message, history, token) {
  const res = await fetch(`${BASE_URL}/Chat/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return await res.json(); 
  // מחזיר { reply, updatedHistory }
}