var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'orbitaltech32@gmail.com',
    pass: 'kcmrreiekjdbfzlk'
  }
});

var mailOptions = {
  from: 'orbitaltech32@gmail.com',
  to: 'vinsdev185@gmail.com',
  subject: 'CONGRATULATIONS,' + 'vin' + ' !',
  text: `You can now proceed to enjoying the packages for which you have subscribed

  Below is the information you will need to proceed.
  
  Admin Panel:
  The Admin Panel will be used to administrate and control the entire functionalities of your School instance created on our platform. Below are the credentials you will need to access it.
  
  Admin Panel Credentials:
  Link: https://www.orbitalnodetechnologies.com/admin
  Username: 123
  Password: 123
  
  
  School Website and Portal:
  This is where the public can access your school website and portal created on our platform. Below is how to access your school on our official website.
  1. Visit https://www.orbitalnodetechnologies.com or download our app on Google Play Store using the following link ...
  2. Type in your school name on the "Visit your school website" field
  3. Click on your school from the search suggestions
  4. Click on "Go" to visit your school website.
  
  After following the above steps, parents and students as well can access anything they want that is available on your school website including the Student Portal where results can be downloaded anytime anywhere once it is released by the school from the admin panel.
  
  
  For detailed explanations on how to use the Admin Panel and School website, check our YouTube channel for tutorials which we have carefully created to guide you through the entire process by clicking on the links provided below.
  Admin Panel tutorial link: ...
  School Website tutorial link: ...
  
  Once again thank you for subscribing to our package.
  
  Regards 
  Orbital Node Technologies.`
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
