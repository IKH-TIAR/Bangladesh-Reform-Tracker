import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const ApproveRejectProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [comments, setComments] = useState({});   

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    // Mock API call
    const response = await axios.get("/api/proposals");
    setProposals(response.data);
  };

  const handleDecision = async (id, status) => {
    const response = await axios.post("/api/proposals/decision", {
      id,
      status,
      comment: comments[id] || "No comment"
    });

    if (response.status === 200) {
      setProposals(proposals.filter((proposal) => proposal.id !== id));
    }
  };



