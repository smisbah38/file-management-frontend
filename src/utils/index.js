import bcrypt from 'bcryptjs'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const types = [
  {
    label: "Admin",
    value: "ADMIN",
  },
  {
    label: "Employee",
    value: "EMPLOYEE",
  },
  {
    label: "Manager",
    value: "MANAGER",
  },
];

export const createPassword = (text)=>{
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(text, salt);
  
} 

export function formatFileSize(fileSizeInBytes) {
  if (fileSizeInBytes < 1024) {
    return fileSizeInBytes + " B";
  } else if (fileSizeInBytes < 1024 * 1024) {
    return (fileSizeInBytes / 1024).toFixed(2) + " KB";
  } else {
    return (fileSizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
  }
}

export const filter = [
  {
    id: "jpg",
    name: "jpg",
    src: "/image/file-format/png.png",
  },
  {
    id: "png",
    name: "Png",
    src: "/image/file-format/png.png",
  },
  {
    id: "jpeg",
    name: "Jpeg",
    src: "/image/file-format/png.png",
  },
  {
    id: "pdf",
    name: "Pdf",
    src: "/image/file-format/pdf.png",
  },
  {
    id: "txt",
    name: "Txt",
    src: "/image/file-format/txt.png",
  },
  {
    id: "doc",
    name: "Doc",
    src: "/image/file-format/doc.png",
  },
  {
    id: "docx",
    name: "Docx",
    src: "/image/file-format/doc.png",
  },
  {
    id: "ppt",
    name: "Ppt",
    src: "/image/file-format/ppt.png",
  },
  {
    id: "pptx",
    name: "Pptx",
    src: "/image/file-format/ppt.png",
  },
  {
    id: "xlsx",
    name: "Xlsx",
    src: "/image/file-format/sheets.png",
  },
  {
    id: "mp4",
    name: "Mp4",
    src: "/image/file-format/video.png",
  },
  {
    id: "folder",
    name: "Folder",
    src: "/image/file-format/folder.png",
  },
];



export const iconMap = [
  {
    type: "jpg",
    src: "/image/file-format/png.png",
  },
  {
    type: "png",
    src: "/image/file-format/png.png",
  },
  {
    type: "jpeg",
    src: "/image/file-format/png.png",
  },
  {
    type: "pdf",
    name: "Pdf",
    src: "/image/file-format/pdf.png",
  },
  {
    type: "txt",
    src: "/image/file-format/txt.png",
  },
  {
    type: "doc",
    src: "/image/file-format/doc.png",
  },
  {
    type: "docx",
    src: "/image/file-format/doc.png",
  },
  {
    type: "ppt",
    src: "/image/file-format/ppt.png",
  },
  {
    type: "pptx",
    src: "/image/file-format/ppt.png",
  },
  {
    type: "xlsx",
    src: "/image/file-format/sheets.png",
  },
  {
    type: "mp4",
    src: "/image/file-format/video.png",
  },
];


export const fileFormat = (file) => iconMap.find(
    (icon) => icon.type === file.type);


export const getDataWithUserDetail = async (snapshot) => {
  const data = [];
  const userPromises = [];
  snapshot.forEach((document) => {
    const userId = document.data().userId;
    const userDocRef = doc(db, "users", userId);
    const userPromise = getDoc(userDocRef).then((userDoc) => {
      return userDoc.exists() ? userDoc.data() : null;
    });
    userPromises.push(userPromise);
    data.push({ ...document.data(), id: document.id });
  });
  // Wait for all userPromises to be resolved
  const userDetailsArray = await Promise.all(userPromises);
  // Merge user details into data
  data.forEach((item, index) => {
    const userDetails = userDetailsArray[index];
    if (userDetails) {
      Object.assign(item, userDetails);
    }
  });

  return data;
};

export const getIsAdmin = async (user) => {
  if (!user) return;

  const currentUserRef = doc(db, "users", user?.uid);
  let isAdmin = false;
  try {
    const docSnapshot = await getDoc(currentUserRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      isAdmin =  data.userType === "ADMIN";
    } 
    return isAdmin;
  } catch (error) {
    console.error("Error getting user document:", error);
    throw error;
  }
};