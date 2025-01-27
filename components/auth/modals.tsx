'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

// Lazy load the modal components
const Modal = dynamic(
  () => import('@/components/ui/modal').then((mod) => mod.Modal),
  {
    ssr: false,
  }
);
const ModalContent = dynamic(() =>
  import('@/components/ui/modal').then((mod) => mod.ModalContent)
);
const ModalHeader = dynamic(() =>
  import('@/components/ui/modal').then((mod) => mod.ModalHeader)
);
const ModalTitle = dynamic(() =>
  import('@/components/ui/modal').then((mod) => mod.ModalTitle)
);
const ModalTrigger = dynamic(() =>
  import('@/components/ui/modal').then((mod) => mod.ModalTrigger)
);

export function TermsModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant='link'
          className='px-0 underline underline-offset-4 hover:text-primary'
        >
          Terms of Service
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Terms of Service</ModalTitle>
        </ModalHeader>
        <div className='space-y-4'>
          <p>Your terms of service content here...</p>
        </div>
      </ModalContent>
    </Modal>
  );
}

export function PrivacyModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant='link'
          className='px-0 underline underline-offset-4 hover:text-primary'
        >
          Privacy Policy
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Privacy Policy</ModalTitle>
        </ModalHeader>
        <div className='space-y-4'>
          <p>Your privacy policy content here...</p>
        </div>
      </ModalContent>
    </Modal>
  );
}
