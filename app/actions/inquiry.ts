'use server'

import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { getLocale } from '@/lib/i18n/server'

export type InquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const company = String(formData.get('company') ?? '').trim()
  const budget = String(formData.get('budget') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in all required fields.' }
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  try {
    const locale = await getLocale()
    await db.insert(inquiries).values({
      locale,
      name,
      email,
      company: company || null,
      budget: budget || null,
      message,
    })
    return { status: 'success' }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again.',
    }
  }
}
