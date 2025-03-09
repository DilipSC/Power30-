export const LogoutCont=(req,res)=>{
    res.cookie('yourAuthCookie', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      res.json({ message: 'Logged out successfully' });
}