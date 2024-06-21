const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'olzhaszholayev@gmail.com',
        pass: 'hhcopsreyklsjuzh'
    }
});

function sendEmail(to, code){
    const mailOptions = {
        from: 'olzhaszholayev@gmail.com',
        to: to,
        subject: 'Verify code:',
        text: `Your verify code ${code}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) console.error(error);
        else console.log(`Email sent: ${info.response}`);
    });
}


module.exports = sendEmail;
