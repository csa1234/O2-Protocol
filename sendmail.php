<?php
// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Get the form data
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Set the recipient email address
    $to = 'ico@o2-protocol.com';

    // Set the email subject
    $subject = 'New message from website contact form';

    // Build the email message
    $body = "First Name: $fname\n"
          . "Last Name: $lname\n"
          . "Phone: $phone\n"
          . "Email: $email\n\n"
          . "Message:\n$message";

    // Set the email headers
    $headers = "From: $email\r\n"
             . "Reply-To: $email\r\n"
             . "X-Mailer: PHP/" . phpversion();

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        echo '<p>Your message has been sent successfully. We will get back to you soon.</p>';
    } else {
        echo '<p>There was a problem sending your message. Please try again later.</p>';
    }

}
?>
