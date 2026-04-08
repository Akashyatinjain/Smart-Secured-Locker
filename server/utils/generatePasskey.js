const generatePasskey = () => {
   return Math.floor(10000000 + Math.random() * 90000000); // 8 digit
};

export default generatePasskey;