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

  const handleCommentChange = (id, value) => {
    setComments({ ...comments, [id]: value });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Approve or Reject Proposals</h2>
      {proposals.length === 0 ? (
        <p>No proposals pending review.</p>
      ) : (
        proposals.map((proposal) => (
          <Card key={proposal.id} className="mb-4 shadow-md p-4">
            <CardContent>
              <h3 className="text-lg font-bold">{proposal.title}</h3>
              <p className="text-gray-600">{proposal.description}</p>
              <Textarea
                placeholder="Add comments (optional)"
                className="mt-2"
                onChange={(e) => handleCommentChange(proposal.id, e.target.value)}
              />
              <div className="flex gap-4 mt-4">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleDecision(proposal.id, "approved")}
                >
                  <CheckCircle className="mr-2" /> Approve
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleDecision(proposal.id, "rejected")}
                >
                  <XCircle className="mr-2" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ApproveRejectProposals;

