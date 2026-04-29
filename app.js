import express from 'express';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VerifyToken;
const wpmToken = process.env.wpmToken;
const phoneNumber = process.env.phoneNumber;
const url = process.env.wpmURL;

app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

app.post('/', (req, res) => {
	const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
	const msgBody = JSON.stringify(req.body, null, 2);
	const msg = msgBody.entry[0].changes[0].value.messages[0].text.body;
	try{
		const res = await fetch(url, {
			method: 'POST',
			headers:{
				"Content-Type": "application/json",
				"Authorization": wpmToken
			},
			body: JSON.stringify({
				"messaging_product":"whatsapp",
				"to": phoneNumber,
				"type":"text",
				"text":{
					"body": msg.split('').reverse().join('')
				}
			})
		});
		const data = await res.json();
	}catch(e){
		console.log(e);
	}
	res.status(200).end();
});
app.get('/test', (req, res) => {
	res.json({"mostafa": "ewis"});
});

app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
