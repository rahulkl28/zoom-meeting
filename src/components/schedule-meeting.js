'use client'

import React, { useState, useEffect } from 'react';
import { getaccessToken } from '@/actions/get-access-token';
import { scheduleMeeting } from '@/actions/schedule-meeting';
import { getMeetingDetials } from '@/actions/meeting-details';
import { useSearchParams, useRouter } from "next/navigation";
import { ZoomMtg } from "@zoomus/websdk";
import Link from 'next/link';
import { LeaveMeeting } from '../actions/leave-meeting';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.2/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');


const ScheduleMeetingForm = () => {
    const [accesstoken, setaccesstoken] = useState("");
    const query = useSearchParams();
    const [meetinginfo, setmeetinginfo] = useState({ id: "", password: "", joinurl: "", starturl: "" })
    const [token, settoken] = useState("");
    const [meetings, setMeetings] = useState([]);
    const router = useRouter();

    const [meetingDetails, setMeetingDetails] = useState({
      topic: 'My Meeting',
      type: 2,
      start_time: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // Set initial start time (2 minutes from now)
      duration: 60,
      timezone: 'Asia/Calcutta',
      agenda: 'Discuss important matters',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: false,
        watermark: false,
        use_pmi: false,
        approval_type: 2,
        registration_type: 1,
        audio: 'both',
        auto_recording: 'none',
      },
    });

    

  
    const fetchZak = async (authToken) => {
        try {
            const zakReq = await fetch(
                `https://api.zoom.us/v2/users/me/token?type=zak`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken || "ixPfTrr5codJbC7pJkTQ8mf9-N7MIR9sQ"}`,
                    },
                }
            );
    
            const { token } = await zakReq.json();
            console.log("zak token : ", token);
    
            if (token) {
                settoken(token);
            }
        } catch (error) {
            console.error("Error fetching Zak token:", error);
        }
    };


    const startMeeting = async () => {
        await fetchZak(accesstoken);
        try {
            if (ZoomMtg.init) {
                ZoomMtg.init({
                    leaveUrl: process.env.NEXT_PUBLIC_URL || "",
                    success: (success) => {
                        if (typeof document != undefined) {
                            const rootElement = document.getElementById("zmmtg-root");
                            if (rootElement) {
                                rootElement.style.display = "block";
                            }
                        }
                        console.log(success);

                         // Set meeting to record by default
                            ZoomMtg.record({
                                record: true,
                            });

                        const signature = ZoomMtg.generateSDKSignature({ sdkKey: "v0claIFUQBKey7Umcmw95g", sdkSecret: "iyxFiFduAwqgF6hMHANxiDidxJ4qKO4s", meetingNumber: meetinginfo.id.toString(), role: "1" });
                        if (ZoomMtg.join) {
                            ZoomMtg.join({
                                passWord: meetinginfo.password,
                                sdkKey: "v0claIFUQBKey7Umcmw95g",
                                signature: signature,
                                meetingNumber: meetinginfo.id,
                                userName: "rahul",
                                zak: token,
                                
                                success: (success) => {
                                    console.log(success);
                                },
                                error: (error) => {
                                    console.log(error);
                                },
                            });
                        }
                    },
                    error: (error) => {
                        console.log(error);
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };


    const joinMeeting = async () => {
        try {
            if (typeof document !== 'undefined') {
                const rootElement = document.getElementById("zmmtg-root");
                if (rootElement) {
                    rootElement.style.display = "block";
                }
            }
            const signature = ZoomMtg.generateSDKSignature({ sdkKey: "v0claIFUQBKey7Umcmw95g", sdkSecret: "iyxFiFduAwqgF6hMHANxiDidxJ4qKO4s", meetingNumber: meetinginfo.id.toString(), role: "0" })

            if (ZoomMtg.init) {
                ZoomMtg.init({
                    leaveUrl: process.env.NEXT_PUBLIC_URL || "",
                    isSupportAV: true,
                    success: (success) => {
                        console.log(success);

                        if (ZoomMtg.join) {
                            ZoomMtg.join({
                                sdkKey: "v0claIFUQBKey7Umcmw95g",
                                signature: signature,
                                meetingNumber: meetinginfo.id,
                                userName: "rahul",
                                success: (success) => {
                                    console.log(success);
                                },
                                error: (error) => {
                                    console.log(error);
                                },
                            });
                        }
                    },
                });
            }
        } catch (error) {
            console.error("Error joining Zoom meeting:", error);
        }
    };

    const accessToken = async (authToken) => {
        console.log("auth token", authToken)
        const at = await getaccessToken({ authToken: authToken })
        console.log("access token", at)
        setaccesstoken(at)
    }

    useEffect(() => {
        const authToken = query.get("code") || "";
        accessToken(authToken);
        if(typeof document != undefined ){
            document.getElementById("zmmtg-root")?.classList.add("hidden")
        }
        fetchZak(authToken);
      }, [query]);
    

    const handleChange = (e) => {
      const { id, value } = e.target;
      setMeetingDetails({
        ...meetingDetails,
        [id]: value,
      });
      console.log(meetingDetails);
    };


    const MeetingList = async () => {
        try {
            const authToken = query.get("code") || "";
            await accessToken(authToken);

            const fetchedMeetings = await getMeetingDetials(accesstoken);
            setMeetings(fetchedMeetings);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };


    const scheduleMeet = async (e) => {
        e.preventDefault();
        const res = await scheduleMeeting({ accesstoken: accesstoken, meetingData: meetingDetails });
        const info = res.json;
        console.log(info);
        setmeetinginfo(info);
        
    };

    const leaveMeeting = async () => {
        // if (ZoomMtg.leave) {
        //   ZoomMtg.leave();
        //   console.log('Leaving the meeting...');
        // }

        const result = await LeaveMeeting({meetingId: meetinginfo.id});
        console.log(result)
      };


    return (
        <div>
            <section className="max-w-4xl z-[9999] p-6 mx-auto rounded-md shadow-md  mt-20">
                <h1 className="text-xl font-bold capitalize">Meeting Details</h1>
                <form onSubmit={scheduleMeet}>
                    <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                        <div>
                            <label className="" htmlFor="topic">topic</label>
                            <input value={meetingDetails.topic} onChange={(e) => handleChange(e)} id="topic" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                        <div>
                            <label className="" htmlFor="agenda">agenda</label>
                            <input value={meetingDetails.agenda} onChange={(e) => handleChange(e)} id="agenda" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                        <div>
                            <label className="" htmlFor="duration">duration</label>
                            <input value={meetingDetails.duration} onChange={(e) => handleChange(e)} id="duration" type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>

                        <div>
                            <label className="" htmlFor="start_time">start time</label>
                            <input value={meetingDetails.start_time} onChange={(e) => handleChange(e)} id="start_time" type="datetime-local" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button type='submit' className="px-6 py-2 leading-5 transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 text-white focus:outline-none focus:bg-gray-600">Schedule</button>
                    </div>
                </form>
            </section>
            <div>
                <h1 className="text-xl  px-4 py-2">Meeting Details</h1>
                <p className="px-4 py-2">meeting id : {meetinginfo.id}</p>
                <p className="px-4 py-2">meeting password : {meetinginfo.password}</p>
                <p className="px-4 py-2">start url : <Link href="{meetinginfo.starturl}">{meetinginfo.starturl}</Link></p>
                <p className="px-4 py-2">join url : <Link href="{meetinginfo.joinurl}">{meetinginfo.joinurl}</Link></p>         
            </div>

           
            
            <div className="h-screen w-screen flex items-center justify-center gap-10 p-10">
                <div className="flex z-[9999] fixed top-0 bg-orange-500 text-xl p-4 text-white gap-8">
                    <button onClick={startMeeting}>Start Meeting</button>
                    <button onClick={joinMeeting}>Join Meeting</button>
                    <button onClick={MeetingList}>Schedule Meetings List</button>
                    <button onClick={leaveMeeting}>Leave Meeting</button>

                    <ul>
                    {meetings.map(meeting => (
                        <li key={meeting.id} className="bg-white shadow-md p-4 mb-4 rounded">
                        <p className="text-orange-500 mb-2">Topic: {meeting.topic}</p>
                        <p className="text-gray-700">Start Time: {new Date(meeting.start_time).toLocaleString()}</p>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
                
            
           
        </div>
    );
};
  
  export default ScheduleMeetingForm;