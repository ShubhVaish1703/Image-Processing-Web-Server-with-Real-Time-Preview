# Image Processing Web Server with Real-Time Preview

This web server offers essential image editing features, including contrast, brightness, saturation, and rotation adjustments. Users benefit from real-time image previews, facilitated by WebSocket technology, which ensures immediate feedback during editing. For image manipulation, the server utilizes the Sharp library, known for its efficient processing capabilities. Once edits are complete, users can download the final image in high quality, choosing between PNG or JPEG formats. This setup combines powerful server-side processing with responsive, real-time updates to deliver a seamless and interactive image editing experience.

DEMO URL - [link](https://drive.google.com/file/d/1ok-MMyxMzZHhVCd6Hw8Ldh0ZIdEhdMV4/view?usp=drive_link)

To run this project use these commands -

**for Server-**

cd server

npm i

npm run build

npm run start

**for client-**

cd client

npm i

npm run build

serve -s build
