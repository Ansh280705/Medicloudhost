"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Clock, History, Ban, ShieldCheck, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { verifyPaymentRequest } from "@/actions/payment";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PaymentRequests({ requests = [], history = [] }) {
    const { user } = useUser();
    const [loadingId, setLoadingId] = useState(null);
    const router = useRouter();

    // Optimistic UI state
    const [pendingRequests, setPendingRequests] = useState(requests);
    const [historyRequests, setHistoryRequests] = useState(history);
    const [sortOrder, setSortOrder] = useState("newest"); // 'newest' | 'oldest'

    // Sync state with props when props change (server refresh)
    useEffect(() => {
        setPendingRequests(requests);

        // Apply initial sort when props change
        const sorted = [...history].sort((a, b) => {
            const dateA = new Date(a.processedAt || a.createdAt);
            const dateB = new Date(b.processedAt || b.createdAt);
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });
        setHistoryRequests(sorted);
    }, [requests, history, sortOrder]);

    const handleVerify = async (requestId, status) => {
        setLoadingId(requestId);
        try {
            // Optimistic update: Remove from pending immediately
            const requestToMove = pendingRequests.find(r => r.id === requestId);
            setPendingRequests(prev => prev.filter(req => req.id !== requestId));

            const res = await verifyPaymentRequest(requestId, status);

            if (res.success) {
                if (status === "APPROVED") {
                    toast.success("Payment Approved");
                } else {
                    toast.success("Payment Rejected");
                }
                // Add to history optimistically (optional, but good for UX)
                if (requestToMove) {
                    setHistoryRequests(prev => [
                        { ...requestToMove, status, processedAt: new Date(), processedBy: user?.firstName || "Admin" },
                        ...prev
                    ]);
                }
                router.refresh(); // Background refresh to ensure data consistency
            } else {
                toast.error(res.error || "Failed");
                // Revert on failure
                if (requestToMove) setPendingRequests(prev => [requestToMove, ...prev]);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error processing request");
        } finally {
            setLoadingId(null);
        }
    };

    const StatusBadge = ({ status }) => {
        switch (status) {
            case "APPROVED":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 flex gap-1 items-center px-2 py-1"><ShieldCheck className="w-3 h-3" /> Approved</Badge>;
            case "REJECTED":
                return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 flex gap-1 items-center px-2 py-1"><Ban className="w-3 h-3" /> Rejected</Badge>;
            default:
                return <Badge variant="secondary" className="flex gap-1 items-center px-2 py-1"><Clock className="w-3 h-3" /> Pending</Badge>;
        }
    };

    const RequestTable = ({ data, showActions = true }) => (
        <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[800px] sm:min-w-full">
                <TableHeader className="bg-card">
                    <TableRow>
                        <TableHead>User Details</TableHead>
                        <TableHead>Amount / Credits</TableHead>
                        <TableHead>Transaction Info</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <AlertCircle className="w-8 h-8 opacity-20" />
                                    <p>No requests found in this section</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((req) => (
                            <TableRow key={req.id} className="hover:bg-card">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">{req.user?.name || "Unknown"}</span>
                                        <span className="text-xs text-muted-foreground">{req.user?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 ">
                                        <span className="font-medium text-sm">₹{req.amount}</span>
                                        <span className="text-xs text-muted-foreground badge badge-outline w-fit px-1.5 py-0.5 rounded border">{req.credits} Credits</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-medium text-black flex items-center gap-2 text-wrap break-all uppercase">
                                            {req.transactionId || "No Txn ID"}
                                            {req.paymentMethod && (
                                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-slate-50 uppercase font-bold text-client border-client/30">
                                                    {req.paymentMethod}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-[10px] text-muted-foreground">
                                            <span>{format(new Date(req.createdAt), "MMM d, yyyy")}</span>
                                            <span>{format(new Date(req.createdAt), "h:mm a")}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 items-start">
                                        <StatusBadge status={req.status} />
                                        {req.processedAt && (
                                            <span className="text-[10px] text-muted-foreground mt-0.5 ml-1">
                                                by {req.processedBy?.split(' ')[0] || "Admin"}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl bg-transparent border-none shadow-none p-0 flex flex-col items-center justify-center">
                                                <DialogHeader className="sr-only"><DialogTitle>Screenshot</DialogTitle></DialogHeader>
                                                <div className="relative bg-white p-2 rounded-lg shadow-xl overflow-hidden max-h-[85vh]">
                                                    <img src={req.screenshotUrl} alt="Payment Screenshot" className="object-contain max-h-[80vh] w-auto rounded" />
                                                    <div className="absolute top-4 right-4 flex gap-2">
                                                        <Button size="sm" variant="secondary" onClick={() => window.open(req.screenshotUrl, '_blank')}>
                                                            Open Original
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {showActions && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => {
                                                        toast("Approve this payment?", {
                                                            description: "This will add credits to the user's account.",
                                                            action: {
                                                                label: "Approve",
                                                                onClick: () => handleVerify(req.id, "APPROVED"),
                                                            },
                                                            cancel: {
                                                                label: "Cancel",
                                                                onClick: () => { },
                                                            },
                                                        });
                                                    }}
                                                    disabled={loadingId === req.id}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8"
                                                    onClick={() => {
                                                        toast("Reject this payment?", {
                                                            description: "Are you sure you want to reject this request?",
                                                            action: {
                                                                label: "Reject",
                                                                onClick: () => handleVerify(req.id, "REJECTED"),
                                                            },
                                                            cancel: {
                                                                label: "Cancel",
                                                                onClick: () => { },
                                                            },
                                                        });
                                                    }}
                                                    disabled={loadingId === req.id}
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <Card className="bg-card border-emerald-900/20">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-client">
                    Payment Requests
                </CardTitle>
                <CardDescription>
                    Review and manage manual payment verification requests.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                            <TabsTrigger
                                value="pending"
                                className="flex items-center gap-2 data-[state=active]:bg-client data-[state=active]:text-white transition-all"
                            >
                                <Clock className="w-4 h-4" /> Pending
                                {requests.length > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5 min-w-5 bg-white/20 text-white hover:bg-white/30 border-none">{requests.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger
                                value="history"
                                className="flex items-center gap-2 data-[state=active]:bg-client data-[state=active]:text-white transition-all"
                            >
                                <History className="w-4 h-4" /> History
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="history">
                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <span className="text-xs font-medium text-muted-foreground">Sort:</span>
                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                    <SelectTrigger className="w-[140px] h-8 text-xs">
                                        <SelectValue placeholder="Sort Order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                    </div>

                    <TabsContent value="pending" className="mt-4">
                        <RequestTable data={pendingRequests} />
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                        <RequestTable data={historyRequests} showActions={false} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
