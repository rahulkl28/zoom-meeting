import React from 'react';
import dynamic from 'next/dynamic';

const DynamicZoomMeeting = dynamic(() => import('@/components/zoom-meeting'), {
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
