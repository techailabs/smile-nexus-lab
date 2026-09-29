import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { MessageCircle, X, CalendarDays, Phone, RotateCcw } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { useClinic } from './site';

export default function ClinicAssistant() {
  const clinic = useClinic();
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, error, stop, setMessages } = useChat({
    id: `clinic-${clinic.id}`,
    transport: new DefaultChatTransport({ api: '/api/clinic-chat', body: { slug: clinic.slug } }),
  });
  useEffect(() => { if (open) input.current?.focus(); }, [open, status]);
  useEffect(() => { const onOpen = () => setOpen(true); window.addEventListener('clinic-assistant-open', onOpen); return () => window.removeEventListener('clinic-assistant-open', onOpen); }, []);
  const busy = status === 'submitted' || status === 'streaming';
  const ask = (text: string) => { if (!busy && text.trim()) sendMessage({ text: text.trim() }); };
  return <>
    {!open && <Button title="Ask the practice assistant" aria-label="Open practice assistant" onClick={() => setOpen(true)} className="fixed bottom-20 right-4 z-50 hidden h-12 md:inline-flex gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-lg md:bottom-6 md:right-6"><MessageCircle className="size-5" /> <span className="hidden sm:inline">Ask {clinic.clinic_name}</span></Button>}
    {open && <div role="dialog" aria-label={`${clinic.clinic_name} assistant`} className="fixed inset-0 z-50 flex flex-col bg-background text-foreground shadow-2xl md:inset-auto md:bottom-6 md:right-6 md:h-[min(680px,85vh)] md:w-[410px] md:rounded-lg md:border md:border-border">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3"><div><p className="font-display text-base font-semibold">{clinic.clinic_name}</p><p className="text-xs text-muted-foreground">Practice assistant · General information only</p></div><div className="flex gap-1"><Button size="icon" variant="ghost" title="New conversation" aria-label="New conversation" onClick={() => setMessages([])}><RotateCcw /></Button><Button size="icon" variant="ghost" title="Close assistant" aria-label="Close assistant" onClick={() => setOpen(false)}><X /></Button></div></header>
      <Conversation className="min-h-0 flex-1"><ConversationContent className="gap-4 px-5 py-5">
        <div className="text-sm leading-relaxed">Hello, I’m the assistant for {clinic.clinic_name}. What would you like to know?</div>
        {messages.length === 0 && <div className="flex flex-wrap gap-2">{['Find the right treatment','Treatment questions','Clinic information','Insurance questions','Emergency dental help'].map(q => <Button key={q} variant="outline" size="sm" className="h-auto whitespace-normal text-left" onClick={() => ask(q)}>{q}</Button>)}</div>}
        {messages.map(m => <Message key={m.id} from={m.role}><MessageContent className={m.role === 'user' ? 'bg-primary text-primary-foreground' : ''}>{m.parts.map((p, i) => p.type === 'text' ? <MessageResponse key={i}>{p.text}</MessageResponse> : null)}</MessageContent></Message>)}
        {status === 'submitted' && <Shimmer className="text-sm">Thinking…</Shimmer>}
        {error && <p role="alert" className="text-sm text-destructive">{error.message || 'The assistant is unavailable. Please contact the practice.'}</p>}
      </ConversationContent><ConversationScrollButton /></Conversation>
      <div className="shrink-0 border-t border-border p-3"><div className="mb-2 flex gap-2"><Button variant="outline" size="sm" asChild><Link to="/clinic/$slug/contact" params={{ slug: clinic.slug }} onClick={() => setOpen(false)}><CalendarDays /> Request a visit</Link></Button>{clinic.phone && <Button variant="outline" size="sm" asChild><a href={`tel:${clinic.phone}`}><Phone /> Call</a></Button>}</div>
        <PromptInput onSubmit={({ text }) => { ask(text); }}><PromptInputTextarea ref={input} placeholder="Ask about this practice…" /><PromptInputFooter className="justify-end"><PromptInputSubmit status={status} onStop={stop} /></PromptInputFooter></PromptInput>
        <p className="mt-2 text-[11px] text-muted-foreground">Not a diagnosis. Please don’t share sensitive medical information.</p>
      </div>
    </div>}
  </>;
}
