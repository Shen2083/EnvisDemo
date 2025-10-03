import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Mail, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "member";
  status: "active" | "pending";
  joinedAt: string;
  linkedAccounts: number;
}

interface PendingInvite {
  id: string;
  email: string;
  invitedAt: string;
  expiresAt: string;
  status: "pending" | "expired";
}

export default function FamilyMembers() {
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [cancelingInviteId, setCancelingInviteId] = useState<string | null>(null);
  
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex@example.com",
      role: "admin",
      status: "active",
      joinedAt: "Jan 2024",
      linkedAccounts: 3,
    },
    {
      id: "2",
      firstName: "Sam",
      lastName: "Morgan",
      email: "sam@example.com",
      role: "member",
      status: "active",
      joinedAt: "Jan 2024",
      linkedAccounts: 2,
    },
  ]);

  const [invites, setInvites] = useState<PendingInvite[]>([
    {
      id: "inv-1",
      email: "jamie@example.com",
      invitedAt: "2 days ago",
      expiresAt: "in 5 days",
      status: "pending",
    },
  ]);

  const handleSendInvite = () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Check if already a member
    if (members.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      toast({
        title: "Already a member",
        description: "This person is already part of your family",
        variant: "destructive",
      });
      return;
    }

    // Check if already invited
    if (invites.some(i => i.email.toLowerCase() === inviteEmail.toLowerCase() && i.status === "pending")) {
      toast({
        title: "Already invited",
        description: "An invitation has already been sent to this email",
        variant: "destructive",
      });
      return;
    }

    const newInvite: PendingInvite = {
      id: `inv-${Date.now()}`,
      email: inviteEmail,
      invitedAt: "Just now",
      expiresAt: "in 7 days",
      status: "pending",
    };

    setInvites([newInvite, ...invites]);
    setInviteEmail("");
    setShowInviteDialog(false);
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    });
  };

  const handleRemoveMember = () => {
    if (removingMemberId) {
      const member = members.find(m => m.id === removingMemberId);
      setMembers(members.filter(m => m.id !== removingMemberId));
      setRemovingMemberId(null);
      
      toast({
        title: "Member removed",
        description: `${member?.firstName} has been removed from your family`,
      });
    }
  };

  const handleCancelInvite = () => {
    if (cancelingInviteId) {
      const invite = invites.find(i => i.id === cancelingInviteId);
      setInvites(invites.filter(i => i.id !== cancelingInviteId));
      setCancelingInviteId(null);
      
      toast({
        title: "Invitation cancelled",
        description: `Invitation to ${invite?.email} has been cancelled`,
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Family Members</h1>
            <p className="text-muted-foreground mt-1">
              Invite family members to share accounts and collaborate on financial goals
            </p>
          </div>
          <Button 
            onClick={() => setShowInviteDialog(true)}
            data-testid="button-invite-member"
          >
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Active Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Members ({members.length})
            </CardTitle>
            <CardDescription>
              Family members with access to shared accounts and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover-elevate"
                  data-testid={`member-${member.id}`}
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{getInitials(member.firstName, member.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        {member.role === "admin" && (
                          <Badge variant="secondary" className="text-xs">Admin</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {member.linkedAccounts} linked accounts • Joined {member.joinedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                    {member.role !== "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRemovingMemberId(member.id)}
                        data-testid={`button-remove-member-${member.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {invites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Pending Invitations ({invites.length})
              </CardTitle>
              <CardDescription>
                Invitations waiting to be accepted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    data-testid={`invite-${invite.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{invite.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Invited {invite.invitedAt} • Expires {invite.expiresAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCancelingInviteId(invite.id)}
                        data-testid={`button-cancel-invite-${invite.id}`}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent data-testid="dialog-invite-member">
            <DialogHeader>
              <DialogTitle>Invite Family Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your family's financial dashboard. They'll be able to link their accounts and collaborate on goals.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="family.member@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  data-testid="input-invite-email"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowInviteDialog(false);
                  setInviteEmail("");
                }}
                data-testid="button-cancel-invite"
              >
                Cancel
              </Button>
              <Button onClick={handleSendInvite} data-testid="button-send-invite">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Member Confirmation */}
        <AlertDialog open={removingMemberId !== null} onOpenChange={(open) => !open && setRemovingMemberId(null)}>
          <AlertDialogContent data-testid="dialog-remove-member">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove family member?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove {members.find(m => m.id === removingMemberId)?.firstName} from your family. Their linked accounts will be disconnected and they won't have access to shared data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-remove">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveMember}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-remove"
              >
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Cancel Invite Confirmation */}
        <AlertDialog open={cancelingInviteId !== null} onOpenChange={(open) => !open && setCancelingInviteId(null)}>
          <AlertDialogContent data-testid="dialog-cancel-invite">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel invitation?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel the invitation to {invites.find(i => i.id === cancelingInviteId)?.email}. They won't be able to join using this invitation link.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-cancel-invite">Keep Invitation</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelInvite}
                data-testid="button-confirm-cancel-invite"
              >
                Cancel Invitation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
