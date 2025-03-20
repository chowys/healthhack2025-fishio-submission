"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  Badge,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Autocomplete,
  Input,
  IconButton,
  Modal,
} from "@mui/material";
import { Star as StarIcon, Verified as VerifiedIcon, Save as SaveIcon, ArrowBack ,Close as CloseIcon} from "@mui/icons-material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface Physiotherapist {
  physioTherapist_id: string;
  physioTherapist_name: string;
  physioTherapist_email: string;
  physioTherapist_profilePic_URL?: string;
  physioTherapist_cert_URL?: string;
  physioTherapist_specialisation?: string[];
  physioTherapist_about?: string;
  physioTherapist_address?: string;
  physioTherapist_password?: string;
  ratings: number;
  verified?: boolean;
  physioTherapist_idcert: string;
}


const Profile = () => {
  const router = useRouter();
  const [physiotherapist, setPhysiotherapist] = useState<Physiotherapist | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedData, setEditedData] = useState<Partial<Physiotherapist>>({
    physioTherapist_specialisation: [], // Initialize as an empty array
  });
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  
      if (!physiotherapist || !physiotherapist.physioTherapist_id) {
        console.error("Physiotherapist ID is missing.");
        return;
      }
  
      console.log("Selected file:", selectedFile);
  
      const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const base64String = reader.result as string;
        setFileUrl(base64String);

        // Save Base64 string in local storage
        localStorage.setItem(`cert_${physiotherapist.physioTherapist_id}`, base64String);
        console.log("Base64 file saved to local storage:", base64String);
      }
    };

    // Read as Data URL (Base64)
    reader.readAsDataURL(selectedFile);
  }
};
  

  useEffect(() => {
    const fetchPhysiotherapist = async () => {
      const userid = localStorage.getItem("user");
      if (!userid) return;
      try {
        const response = await axios.get(`http://localhost:3000/physiotherapists/${userid}`);
        setPhysiotherapist(response.data);
        setEditedData(response.data);
      } catch (error) {
        console.error("Error fetching physiotherapist data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhysiotherapist();
  }, []);

  useEffect(() => {
    if (!physiotherapist?.physioTherapist_id) return;
  
    const savedBase64 = localStorage.getItem(`cert_${physiotherapist.physioTherapist_id}`);
    console.log("Retrieved from local storage:", savedBase64);
  
    if (savedBase64) {
      setFileUrl(savedBase64);
    }
  }, [physiotherapist]);
  
  
 const handleUpdate = async () => {
  if (!physiotherapist) {
    alert("No physiotherapist data found.");
    return;
  }

  const userid = localStorage.getItem("user");
  if (!userid) {
    alert("User ID not found. Please log in again.");
    return;
  }

  try {
    // Prepare the updated data
    const updatedData = {
      physioTherapist_name: editedData.physioTherapist_name || physiotherapist.physioTherapist_name || "",
      physioTherapist_email: editedData.physioTherapist_email || physiotherapist.physioTherapist_email || "",
      physioTherapist_password: physiotherapist.physioTherapist_password,
      physioTherapist_profilePic_URL: editedData.physioTherapist_profilePic_URL || physiotherapist.physioTherapist_profilePic_URL || "",
      physioTherapist_cert_URL: editedData.physioTherapist_cert_URL || physiotherapist.physioTherapist_cert_URL || "",
      physioTherapist_address: editedData.physioTherapist_address || physiotherapist.physioTherapist_address || "",
      physioTherapist_about: editedData.physioTherapist_about || physiotherapist.physioTherapist_about || "",
      physioTherapist_specialisation: editedData.physioTherapist_specialisation || physiotherapist.physioTherapist_specialisation || [],
      physioTherapist_idcert: editedData.physioTherapist_idcert || physiotherapist.physioTherapist_idcert || "",
      ratings: editedData.ratings || physiotherapist.ratings || 0,
    };

    // Remove undefined fields from the updatedData object
    const filteredUpdatedData = Object.fromEntries(
      Object.entries(updatedData).filter(([_, value]) => value !== undefined)
    );

    console.log("Sending updated data:", filteredUpdatedData);

    // Send the PUT request to update the physiotherapist
    const response = await axios.put(`http://localhost:3000/physiotherapists/${userid}`, filteredUpdatedData);

    if (response.status === 200) {
      // Update the local state with the new data
      setPhysiotherapist((prev) => ({ ...prev, ...filteredUpdatedData } as Physiotherapist));
      alert("Profile updated successfully!");
      router.push('/');
    } else {
      alert("Failed to update profile. Please try again.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);

    // Log the detailed error response from the server
    if (error.response) {
      console.error("Server response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }

    alert(`Failed to update profile: ${error.response?.data?.error || error.message}`);
  }
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ maxWidth: 500, p: 3, textAlign: "center", boxShadow: 3 }}>
        <Badge badgeContent={<StarIcon color="warning" />}>
          <Avatar src={physiotherapist?.physioTherapist_profilePic_URL || "/default-avatar.png"} sx={{ width: 120, height: 120, mx: "auto" }} />
        </Badge>
        <Typography color="textSecondary">{physiotherapist?.physioTherapist_email}</Typography>
        
        <CardContent>
          <TextField label="Name" fullWidth variant="outlined" sx={{ mb: 2 }}
            value={editedData.physioTherapist_name || ""} onChange={(e) => setEditedData({ ...editedData, physioTherapist_name: e.target.value })} />
          <TextField label="Physio ID" fullWidth variant="outlined" sx={{ mb: 2 }}
            value={editedData.physioTherapist_idcert || ""} onChange={(e) => setEditedData({ ...editedData, physioTherapist_idcert: e.target.value })} />

          <TextField label="Address" fullWidth variant="outlined" sx={{ mt: 2 }}
            value={editedData.physioTherapist_address || ""} onChange={(e) => setEditedData({ ...editedData, physioTherapist_address: e.target.value })} />

          <TextField label="About" fullWidth multiline rows={3} variant="outlined" sx={{ mt: 2 }}
            value={editedData.physioTherapist_about || ""} onChange={(e) => setEditedData({ ...editedData, physioTherapist_about: e.target.value })} />

<FormControl fullWidth sx={{ mt: 2 }}>
  <Autocomplete
    multiple
    disableCloseOnSelect
    options={specialisationOptions}
    value={Array.isArray(editedData.physioTherapist_specialisation) ? editedData.physioTherapist_specialisation : []} // Ensure it's always an array
    onChange={(_, value) => {
      setEditedData({
        ...editedData,
        physioTherapist_specialisation: value,
      });
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Specialisation"
        placeholder="Search or select specialisations"
      />
    )}
    renderTags={(value, getTagProps) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {value.map((option, index) => (
          <Chip key={option} label={option} {...getTagProps({ index })} />
        ))}
      </Box>
    )}
    renderOption={(props, option) => (
      <MenuItem {...props} sx={{ fontSize: "0.875rem" }}>
        {option}
      </MenuItem>
    )}
    ListboxProps={{
      style: {
        maxHeight: "200px", // Adjust the height of the dropdown
        overflow: "auto", // Make the dropdown scrollable
      },
    }}
  />
</FormControl>

          <Typography variant="h6" sx={{ mt: 2, mb: 5}}>⭐ {4.5} / 5.0</Typography>
          <Typography variant="h8" >AHPC Physiotherapist Certificate Upload:</Typography>
          <Box sx={{ p: 1 }}>
      {/* File Upload Input */}
      <TextField
        fullWidth
        type="file"
        inputProps={{ accept: "image/*, application/pdf" }}
        onChange={handleFileChange}
        sx={{ mt: 2 }}
      />

{fileUrl && (
  <>
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0 }}>
      {/* Small Preview */}
      {true ? (
        <img
          src={fileUrl}
          alt="Preview"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      ) : (
        <PictureAsPdfIcon sx={{ fontSize: 40, color: "gray" }} /> // Show PDF icon if it's a PDF
      )}

    <Button
      variant="contained"
      color="primary"
      sx={{ mt: 3 }} // Adjust spacing so text and button look good
      startIcon={physiotherapist.verified ? <VerifiedIcon /> : "❌"}
      onClick={handleOpenModal} // Open modal instead of navigating to a new tab
    >
      View Certification
    </Button>
</Box>
    <Typography
      sx={{
        mt: 2,
        color: physiotherapist.verified ? "green" : "red",
        fontWeight: "bold",
        fontSize: "0.7.15rem",
      }}
    >
      {physiotherapist.verified
        ? "✅ Certificate verified!"
        : "❌ Certificate is still undergoing verification :("}
    </Typography>
  </>
)}

      

      {/* Modal to Display File */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "800px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 2 }}>
            {file?.type === "application/pdf" ? (
              <iframe
                src={fileUrl}
                width="100%"
                height="500px"
                style={{ border: "none" }}
                title="PDF Preview"
              />
            ) : (
              <img
                src={fileUrl}
                alt="Uploaded"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </Box>

          <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
            <Button variant="outlined" color="secondary" startIcon={<ArrowBack />} onClick={() => router.back()}>Back</Button>
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleUpdate}>Update</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

const specialisationOptions = [
  "Sports Injury",
  "Rehabilitation",
  "Orthopedic",
  "Neurological",
  "Pediatric",
  "Geriatric",
  "Cardiopulmonary",
  "Women's Health",
  "Musculoskeletal",
  "Vestibular Rehabilitation",
  "Oncology Rehabilitation",
  "Hand Therapy",
  "Pelvic Health",
  "Chronic Pain Management",
  "Post-Surgical Rehabilitation",
  "Ergonomic Assessment",
  "Occupational Therapy",
  "Aquatic Therapy",
  "Manual Therapy",
  "Sports Performance",
  "Preventive Care",
  "Postural Correction",
  "Balance and Fall Prevention",
  "Stroke Rehabilitation",
  "Spinal Cord Injury Rehabilitation",
  "Amputee Rehabilitation",
  "Arthritis Management",
  "Temporomandibular Joint (TMJ) Therapy",
  "Lymphedema Management",
  "Vestibular and Balance Disorders",
  "Concussion Management",
  "Workplace Injury Rehabilitation",
  "Geriatric Mobility Enhancement",
  "Pediatric Developmental Disorders",
  "Postpartum Rehabilitation",
  "Chronic Fatigue Syndrome Management",
  "Fibromyalgia Management",
  "Osteoporosis Management",
  "Parkinson's Disease Rehabilitation",
  "Multiple Sclerosis Rehabilitation",
  "Autism Spectrum Disorder Therapy",
  "Cerebral Palsy Rehabilitation",
  "Post-Traumatic Stress Disorder (PTSD) Therapy",
  "Bariatric Rehabilitation",
  "Diabetes Management",
  "Respiratory Therapy",
  "Post-Covid Rehabilitation",
  "Cancer Rehabilitation",
  "Burn Rehabilitation",
  "Dance Medicine",
  "Running Injury Prevention",
  "Yoga Therapy",
  "Pilates-Based Rehabilitation",
  "Strength and Conditioning",
  "Functional Movement Therapy",
  "Myofascial Release Therapy",
  "Dry Needling",
  "Kinesiology Taping",
  "Prosthetics and Orthotics",
  "Wheelchair Mobility Training",
  "Adaptive Sports Therapy",
  "Pediatric Orthopedics",
  "Pediatric Neurology",
  "Pediatric Cardiopulmonary",
  "Pediatric Oncology",
  "Pediatric Sports Injuries",
  "Pediatric Developmental Delays",
  "Pediatric Post-Surgical Rehabilitation",
  "Pediatric Chronic Pain Management",
  "Pediatric Balance and Coordination",
  "Pediatric Aquatic Therapy",
  "Pediatric Manual Therapy",
  "Pediatric Strength and Conditioning",
  "Pediatric Yoga Therapy",
  "Pediatric Pilates-Based Rehabilitation",
  "Pediatric Functional Movement Therapy",
  "Pediatric Myofascial Release Therapy",
  "Pediatric Dry Needling",
  "Pediatric Kinesiology Taping",
  "Pediatric Prosthetics and Orthotics",
  "Pediatric Wheelchair Mobility Training",
  "Pediatric Adaptive Sports Therapy",
];



export default Profile;
