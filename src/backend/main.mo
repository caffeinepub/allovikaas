import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Char "mo:core/Char";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Category = {
    name : Text;
    subcategories : [Text];
  };

  public type CategoryMapping = {
    category : Text;
    subcategories : [Text];
  };

  type SubcategoryToCategory = {
    subcategory : Text;
    category : Text;
  };

  let normalizedCategories : [Category] = [
    {
      name = "Household Services";
      subcategories = ["Plumber", "Electrician", "Painter", "Carpenter", "Maid"];
    },
    {
      name = "Vehicle Services";
      subcategories = ["Mechanic", "Driver", "Car Wash"];
    },
    {
      name = "Home Improvement";
      subcategories = ["Interior Designer", "Architect", "Landscape Gardener"];
    },
    {
      name = "Specialized Cleaning";
      subcategories = ["Carpet Cleaner", "Window Washer", "Upholstery Cleaner", "Deep Cleaning Specialist"];
    },
    {
      name = "Skilled Trades";
      subcategories = ["Welder", "Tiler", "Bricklayer", "Roofer", "Plasterer"];
    },
    {
      name = "Electronics & Appliances";
      subcategories = ["AC Repair", "Refrigeration Specialist", "TV/Audio", "Appliance Installer"];
    },
    {
      name = "Security Services";
      subcategories = ["Security Camera Installer", "Locksmith", "Alarm System Specialist"];
    },
    {
      name = "Pest Control";
      subcategories = ["Pest Control", "Termite Treatment", "Fumigation"];
    },
    {
      name = "Beauty & Wellness";
      subcategories = ["Barber", "Beautician", "Masseuse", "Manicurist"];
    },
    {
      name = "Fitness Services";
      subcategories = ["Personal Trainer", "Yoga Instructor"];
    },
    {
      name = "Tutoring & Education";
      subcategories = ["Private Tutor", "Music Teacher", "Dance Instructor"];
    },
    {
      name = "Event Services";
      subcategories = ["Event Planner", "Catering", "Photographer", "Decorator"];
    },
    {
      name = "General Services";
      subcategories = ["Admin", "Helper", "Handyman", "Laborer", "Driver", "Housekeeper"];
    },
    {
      name = "Construction";
      subcategories = [
        "Construction",
        "Builder",
        "Contractor",
        "Mason",
        "Laborer",
        "Plasterer",
        "Tiler",
        "Painter",
        "Electrician",
        "Plumber",
        "Carpenter",
        "Welder",
      ];
    },
    {
      name = "Wood & Metal";
      subcategories = ["Carpenter", "Welder"];
    },
    { name = "Tree Work"; subcategories = ["Roofer"] },
    { name = "Home Help"; subcategories = ["Housekeeper"] },
    {
      name = "Tailoring";
      subcategories = [
        "Beautician",
        "Blouse Stitching",
        "Saree Work",
        "Saree Falls/Pico"
      ];
    },
    {
      name = "Agriculture";
      subcategories = ["Vegetable/Fruit Picker", "Farm Machinery/Tools Repairsman", "Irrigation Specialist"];
    },
    {
      name = "Healthcare & Wellness";
      subcategories = ["Nurse", "Healthcare Aide", "Physical Therapist", "Homeopathy"];
    },
    {
      name = "Local Skilled Workers";
      subcategories = [
        "Plumber",
        "Electrician",
        "Painter",
        "Maid",
        "Housekeeper",
        "Barber",
        "Beautician",
        "Driver",
        "Security",
        "Daily Labours",
        "Helper",
        "Admin",
        "Labour",
        "General Labour",
        "Admin Assistant",
        "Household Helper",
      ];
    },
  ];

  let generalSubcategories : [SubcategoryToCategory] = [
    { subcategory = "Plumber"; category = "Local Skilled Workers" },
    { subcategory = "Electrician"; category = "Local Skilled Workers" },
    { subcategory = "Painter"; category = "Local Skilled Workers" },
    { subcategory = "Maid"; category = "Local Skilled Workers" },
    { subcategory = "Housekeeper"; category = "Local Skilled Workers" },
    { subcategory = "Barber"; category = "Local Skilled Workers" },
    { subcategory = "Beautician"; category = "Local Skilled Workers" },
    { subcategory = "Driver"; category = "Local Skilled Workers" },
    { subcategory = "Security"; category = "Local Skilled Workers" },
    { subcategory = "Daily Labours"; category = "Local Skilled Workers" },
    { subcategory = "Helper"; category = "Local Skilled Workers" },
    { subcategory = "Admin"; category = "Local Skilled Workers" },
    { subcategory = "Labour"; category = "Local Skilled Workers" },
    { subcategory = "General Labour"; category = "Local Skilled Workers" },
    { subcategory = "Admin Assistant"; category = "Local Skilled Workers" },
    { subcategory = "Household Helper"; category = "Local Skilled Workers" },
  ];

  public query func getAllCategories() : async [CategoryMapping] {
    normalizedCategories.map(
      func(cat) {
        {
          category = cat.name;
          subcategories = cat.subcategories;
        };
      }
    );
  };

  public query func getCategoryBySubcategory(subcategory : Text) : async ?Text {
    let mapped = generalSubcategories.find(
      func(mapping) {
        Text.equal(mapping.subcategory, subcategory);
      }
    );
    switch (mapped) {
      case (null) { null };
      case (?mapping) { ?mapping.category };
    };
  };

  public type UserProfile = {
    name : Text;
    phone : ?Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type Location = {
    lat : Float;
    lon : Float;
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
    dateTime : Time.Time;
    salary : Text;
    description : Text;
    phone : Text;
    status : {
      #pending;
      #approved;
      #rejected;
    };
  };

  var nextWorkerId = 1;
  var nextJobId = 1;

  let workers = Map.empty<Nat, Worker>();
  let jobPosts = Map.empty<Nat, JobPost>();

  // UserApproval integration
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public shared ({ caller }) func submitWorkerRegistration(
    name : Text,
    phone : Text,
    area : Text,
    category : Text,
    skills : [Text],
    availableTime : Text,
    experience : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit worker registrations");
    };

    if (name.trim(#char(' ')).size() == 0 or phone.trim(#char(' ')).size() == 0 or area.trim(#char(' ')).size() == 0 or category.trim(#char(' ')).size() == 0) {
      return "Invalid input: Missing required fields";
    };

    let id = nextWorkerId;
    nextWorkerId += 1;

    let worker : Worker = {
      id;
      userId = caller;
      name;
      phone;
      area;
      category;
      skills;
      availableTime;
      experience;
      status = #active;
    };

    workers.add(id, worker);
    "Successfully submitted a new worker.";
  };

  // PUBLIC endpoint for anyone (including anonymous users) to fetch all active workers
  public query ({ caller }) func getPublicWorkers() : async [Worker] {
    workers.values().toArray().filter(func(w) { w.status == #active });
  };

  public query ({ caller }) func getWorkerById(id : Nat) : async ?Worker {
    let worker = workers.get(id);
    switch (worker) {
      case (null) { null };
      case (?w) {
        if (w.status == #active or AccessControl.isAdmin(accessControlState, caller)) {
          ?w;
        } else {
          null;
        };
      };
    };
  };

  public shared ({ caller }) func rejectWorker(workerId : Nat, reason : Text) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject workers");
    };

    switch (workers.get(workerId)) {
      case (null) { false };
      case (?worker) {
        let updatedWorker = { worker with status = #rejected(reason) };
        workers.add(workerId, updatedWorker);
        true;
      };
    };
  };
};
