"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  message: z.string().min(5, "Please tell us a little more"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    // Auth-free, no backend required: route the enquiry to WhatsApp with a
    // pre-filled message. (A server action can be added later to also store it.)
    const text = `Hi Dr. Priyal's team,%0A%0AName: ${values.name}%0APhone: ${values.phone}${
      values.email ? `%0AEmail: ${values.email}` : ""
    }%0A%0A${encodeURIComponent(values.message)}`;
    window.open(`https://wa.me/${site.whatsapp}?text=${text}`, "_blank");
    toast.success("Opening WhatsApp to send your message…");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" placeholder="Full name" {...register("name")} />
        {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+91…" {...register("phone")} />
          {errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" placeholder="you@email.com" {...register("email")} />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea id="message" rows={5} placeholder="Share your question or concern…" {...register("message")} />
        {errors.message && <p className="text-xs text-danger">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="justify-self-start">
        <Send />
        Send via WhatsApp
      </Button>
      <p className="text-xs text-ink-faint">
        For medical emergencies, please visit the nearest hospital. This form is for general
        enquiries only.
      </p>
    </form>
  );
}
