"use client";

import { DefaultChatTransport, UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";

import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { X, Send, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Streamdown } from "streamdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_MESSAGES = ["Monte meu plano de treino"];

const ONBOARDING_MESSAGES = [
  "Bem-vindo ao FIT.AI! 🎉",
  "O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.",
  "Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.",
  "Vamos configurar seu perfil?",
];

const formSchema = z.object({
  message: z.string().min(1, {
    message: "A mensagem não pode estar vazia.",
  }),
});

function getUIMessageText(m: UIMessage) {
  return m.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function Chatbot({
  mode = "overlay",
  customHeader,
}: {
  mode?: "overlay" | "page";
  customHeader?: React.ReactNode;
}) {
  const [chatParams, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/backend/ai/",
      credentials: "include",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatParams.chat_open && chatParams.chat_initial_message) {
      sendMessage({ text: chatParams.chat_initial_message });
      setChatParams({ chat_initial_message: null });
    }
  }, [
    chatParams.chat_open,
    chatParams.chat_initial_message,
    sendMessage,
    setChatParams,
  ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendMessage({ text: values.message });
    form.reset();
  }

  if (mode === "overlay" && !chatParams.chat_open) return null;

  return (
    <div
      className={cn(
        mode === "overlay"
          ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          : "flex h-full w-full flex-col bg-background",
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden bg-background",
          mode === "overlay"
            ? "max-h-[640px] overflow-y-auto w-full max-w-[361px] rounded-[20px] shadow-xl"
            : "w-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground leading-tight tracking-tight">
                Coach AI
              </span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#24D500]" />
                <span className="text-xs text-primary font-normal">Online</span>
              </div>
            </div>
          </div>
          {customHeader || (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatParams({ chat_open: false })}
              className="rounded-full"
            >
              <X className="size-6 text-foreground" />
            </Button>
          )}
        </div>

        <Separator />

        {/* Messages */}
        <ScrollArea className="flex-1 p-5">
          <div className="space-y-5 pb-4">
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                {mode === "page" ? (
                  ONBOARDING_MESSAGES.map((msg, i) => (
                    <div
                      key={i}
                      className="max-w-[85%] self-start rounded-xl bg-muted p-3 text-sm text-foreground"
                    >
                      {msg}
                    </div>
                  ))
                ) : (
                  <div className="max-w-[85%] self-start rounded-xl bg-muted p-3 text-sm text-foreground">
                    Olá! Sou sua IA personal. Como posso ajudar com seu treino
                    hoje?
                  </div>
                )}
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex max-w-[85%] flex-col gap-1 rounded-xl p-3 text-sm",
                  m.role === "user"
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-muted text-foreground",
                )}
              >
                <Streamdown>{getUIMessageText(m)}</Streamdown>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-5 border-t border-border flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {mode === "page" ? (
                <Badge
                  variant="default"
                  className="cursor-pointer whitespace-nowrap bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors border-none font-normal rounded-xl"
                  onClick={() => {
                    sendMessage({ text: "Começar!" });
                  }}
                >
                  Começar!
                </Badge>
              ) : (
                SUGGESTED_MESSAGES.map((msg) => (
                  <Badge
                    key={msg}
                    variant="secondary"
                    className="cursor-pointer whitespace-nowrap bg-[#E2E9FE] px-4 py-2 text-sm text-foreground hover:bg-[#D5DFFE] transition-colors border-none font-normal"
                    onClick={() => {
                      sendMessage({ text: msg });
                    }}
                  >
                    {msg}
                  </Badge>
                ))
              )}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-0">
                    <FormControl>
                      <Input
                        placeholder="Digite sua mensagem"
                        className="h-11 rounded-full border-border bg-muted px-4 py-3 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="icon"
                disabled={
                  status === "submitted" ||
                  status === "streaming" ||
                  !form.watch("message")?.trim()
                }
                className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground disabled:opacity-50 transition-opacity"
              >
                <Send className="size-5" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
