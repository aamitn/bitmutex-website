import React from 'react'
import { LogoutButton } from '@/components/custom/logout-button'
import CookieConsentControls from '@/components/cookie/CookieConsentApiControls';


export default function DashboardRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
      <h1>Dashboard Route Placeholder</h1>
      <CookieConsentControls />
      <LogoutButton />
    </div>
  )
}
