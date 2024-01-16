'use client';

import { useSearchParams, useRouter } from "next/navigation";


const ZoomMeeting = () => {
    const query = useSearchParams();
    const router = useRouter();
    const authToken = query.get("code") || "";
   




    return (
        <div className="h-screen  w-screen flex items-center justify-center gap-10 p-10">
        <div className="flex z-[9999] fixed top-0 bg-orange-500 text-xl p-4 text-white gap-8">
            <button onClick={()=> router.push(`https://zoom.us/oauth/authorize?response_type=code&client_id=v0claIFUQBKey7Umcmw95g&redirect_uri=${process.env.NEXT_PUBLIC_URL}/schedule`)}>Schedule Meeting/Join Meeting</button>
        </div>
       
    </div>
    
    );
};

export default ZoomMeeting;







