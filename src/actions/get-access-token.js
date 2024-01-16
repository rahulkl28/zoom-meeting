"use server";

export const getaccessToken = async ({ authToken }) => {
    const data = new URLSearchParams();
    let token = ""
    data.append("code", authToken);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", `https://zoom-meeting-omega.vercel.app/`);
    data.append("client_id", "v0claIFUQBKey7Umcmw95g");
    data.append("client_secret", 'iyxFiFduAwqgF6hMHANxiDidxJ4qKO4s');
    
    const res = await fetch("https://zoom.us/oauth/token", {
        method: "POST",
        body: data,
    });

    const json = await res.json();
    console.log(json);

    if (json.access_token) {
        return json.access_token;
    }
};