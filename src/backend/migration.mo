import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  public type Category = {
    name : Text;
    subcategories : [Text];
  };

  public type UserProfile = {
    name : Text;
    phone : ?Text;
    email : ?Text;
  };

  public type Worker = {
    id : Nat;
    userId : Principal;
    name : Text;
    phone : Text;
    area : Text;
    category : Text;
    skills : [Text];
    availableTime : Text;
    experience : Text;
    status : {
      #active;
      #rejected : Text;
    };
  };

  public type JobPost = {
    id : Nat;
    workType : Text;
    area : Text;
    dateTime : Int;
    salary : Text;
    description : Text;
    phone : Text;
    status : {
      #pending;
      #approved;
      #rejected;
    };
  };

  public type OldActor = {
    normalizedCategories : [Category];
    userProfiles : Map.Map<Principal, UserProfile>;
    nextWorkerId : Nat;
    nextJobId : Nat;
    workers : Map.Map<Nat, Worker>;
    jobPosts : Map.Map<Nat, JobPost>;
  };

  public type NewActor = OldActor;

  // Migration function to migrate old data to new actor
  public func run(old : OldActor) : NewActor { old };
};
