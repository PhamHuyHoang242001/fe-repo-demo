export enum ERROR_CODE {
  'A001' = 'Field is mandatory',
  'A002' = 'Format is incorrect',
  'A003' = 'OTP is incorrect. Please try again',
  'A004' = 'Passwords do not match. Please try again',
  'A005' = 'Please agree to terms and conditions to continue',
  'A006' = 'Please wait to resend OTP',
  'A007' = 'Password/ Email is incorrect. Please try again',
  'A008' = 'Email is not eligible. Please try again',
  'A009' = 'Email has been already used. Please try again',
  'A010' = 'OTP request is limited to 5 times. Try again after mm:ss',
  'A011' = 'OTP has expired. Please try again!',
  'A012' = 'New OTP code has been sent to your email address',
  'A013' = 'You must be older than 18 years old to create an account',

  'ERROR' = 'An error occurred, please try again',
}

export enum StatusCodeEnum {
  'OK' = 200,
  'Bad Request' = 400,
  'Unauthorized' = 401,
  'Forbidden' = 403,
  'Internal Server Error' = 500,
}
