"use server"


export const LeaveMeeting = async ({accesstoken}) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    const { meetingId } = req.body;
    
      try {
        const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}/status`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accesstoken}`,
          },
          body: JSON.stringify({
            action: 'end',
          }),
        });
    
        if (!response.ok) {
          throw new Error(`Error ending meeting: ${response.statusText}`);
        }
    
        const data = await response.json();
    
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error ending meeting:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
} 
