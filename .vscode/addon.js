const arrayBufferToBase64 = buffer => {
	var binary = "";
	var bytes = [].slice.call(new Uint8Array(buffer));
	bytes.forEach(b => (binary += String.fromCharCode(b)));
	return window.btoa(binary);
};
const [img, setImg] = useState("");
const getImgProfile = () => {
	fetch("/api/img")
		.then(res => res.json())
		.then(data => {
			console.log(data);
			const base64Flag = "data:image/jpg;base64,";
			const imageStr = arrayBufferToBase64(data.img.data.data);
			setImg(base64Flag + imageStr);
		});
};
