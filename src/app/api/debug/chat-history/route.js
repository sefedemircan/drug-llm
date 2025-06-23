import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase istemcisini oluştur
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get('sessionId');
		
		if (!sessionId) {
			return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
		}

		console.log('🔍 Debug: Getting chat history for session:', sessionId);

		// Chat mesajlarını çek
		const { data: messages, error } = await supabase
			.from('chat_messages')
			.select('*')
			.eq('session_id', sessionId)
			.order('created_at', { ascending: true });

		if (error) {
			console.error('❌ Error fetching messages:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		console.log('📜 Found messages:', messages?.length || 0);
		console.log('📝 Messages detail:', messages?.map(m => ({
			id: m.id,
			role: m.role,
			content: m.content?.substring(0, 50) + '...',
			created_at: m.created_at
		})));

		return NextResponse.json({
			sessionId,
			messageCount: messages?.length || 0,
			messages: messages || []
		});

	} catch (error) {
		console.error('❌ Debug API error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
} 