"use server"

export const getMeetingDetials = async (accessToken) => {
const res = await fetch("https://api.zoom.us/v2/users/me/meetings?type=scheduled&page_size=30", {
    method: "GET",
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
})

const meetings = await res.json();
console.log(meetings);

if(meetings && meetings.meetings){
    return meetings.meetings;
}
return [];

}
