import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const options = {
    method: 'GET',
    url: `https://${process.env.NEXT_PUBLIC_GOOGLE_HOST}/api/v1/searchFlights`,
    params: {
      departure_id: from,
      arrival_id: to,
      outbound_date: date,
      currency: 'PLN',
      hl: 'pl'
    },
    headers: {
      'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.NEXT_PUBLIC_GOOGLE_HOST
    }
  };

  try {
    const response = await axios.request(options);
    // Logujemy surową odpowiedź do terminala, żebyś widział co tam jest
    console.log("SUROWE DANE Z GOOGLE:", JSON.stringify(response.data).substring(0, 200));
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Błąd API' }, { status: 500 });
  }
}