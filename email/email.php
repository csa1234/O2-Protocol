<?php

$fname = trim($_POST['fname']);
$lname = trim($_POST['lname']);
$email = trim($_POST['email']);
$phone = (isset($_POST['phone']))?trim($_POST['phone']):'';
$_message = trim($_POST['message']);


if ($fname == "") {
    $msg['err'] = "\n First name can not be empty!";
    $msg['field'] = "fname";
    $msg['code'] = FALSE;
} else if ($lname == "") {
    $msg['err'] = "\n Last name can not be empty!";
    $msg['field'] = "lname";
    $msg['code'] = FALSE;
} else if ($phone == "") {
    if(isset($_POST['phone'])){
        $msg['err'] = "\n Phone number can not be empty!";
        $msg['field'] = "phone";
        $msg['code'] = FALSE;
    }
} else if (!preg_match("/^[0-9\\-\\+]{4,17}$/", trim($phone))) {
    $msg['err'] = "\n Please put a valid phone number!";
    $msg['field'] = "phone";
    $msg['code'] = FALSE;
} else if ($email == "") {
    $msg['err'] = "\n Email can not be empty!";
    $msg['field'] = "Email";
    $msg['field'] = "email";
    $msg['code'] = FALSE;
} else if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $msg['err'] = "\n Please put a valid email address!";
    $msg['field'] = "email";
    $msg['code'] = FALSE;
} else {
    $to = 'test@example.com';
    $subject = 'iCO Landing - Contact Request';
    $message = '<html><head></head><body>';
    $message .= '<p>First Name: ' . $fname . '</p>';
    $message .= '<p>Last Name: ' . $lname . '</p>';
    $message .= '<p>Email: ' . $email . '</p>';
    $message .= '<p>Phone: ' . $phone . '</p>';
    $message .= '<p>Message: ' . $_message . '</p>';
    $message .= '</body></html>';
    $headers = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'From:  '.$fname.' <'.$email.'>' . "\r\n";
    $headers .= 'cc: test@example.com' . "\r\n";
    $headers .= 'bcc: test@example.com' . "\r\n";

    mail($to, $subject, $message, $headers, '-f tex@example.com');

    $msg['success'] = "\n Email has been sent successfully.";
    $msg['code'] = TRUE;
}

echo json_encode($msg);