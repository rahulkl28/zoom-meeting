import React from 'react';
import dynamic from 'next/dynamic';

const DynamicZoomMeeting = dynamic(() => import('@/components/schedule-meeting'), {
  ssr: false, // Prevent server-side rendering
});

const Page = () => {
  return (
    <div>
      <DynamicZoomMeeting />
    </div>
  );
};

export default Page;
