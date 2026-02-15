import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
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

  type SubcategoryMapping = {
    subcategory : Text;
    parentCategory : Text;
  };

  type SubcategoryToCategory = {
    subcategory : Text;
    category : Text;
  };

  var categories : [Category] = [
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
      subcategories = [
        "Carpet Cleaner",
        "Window Washer",
        "Upholstery Cleaner",
        "Deep Cleaning Specialist",
      ];
    },
    {
      name = "Skilled Trades";
      subcategories = [
        "Welder",
        "Tiler",
        "Bricklayer",
        "Roofer",
        "Plasterer",
      ];
    },
    {
      name = "Electronics & Appliances";
      subcategories = [
        "AC Repair",
        "Refrigeration Specialist",
        "TV/Audio",
        "Appliance Installer",
      ];
    },
    {
      name = "Security Services";
      subcategories = [
        "Security Camera Installer",
        "Locksmith",
        "Alarm System Specialist",
      ];
    },
    {
      name = "Pest Control";
      subcategories = [
        "Pest Control",
        "Termite Treatment",
        "Fumigation",
      ];
    },
    {
      name = "Beauty & Wellness";
      subcategories = [
        "Barber",
        "Beautician",
        "Masseuse",
        "Manicurist",
      ];
    },
    {
      name = "Fitness Services";
      subcategories = ["Personal Trainer", "Yoga Instructor"];
    },
    {
      name = "Tutoring & Education";
      subcategories = [
        "Private Tutor",
        "Music Teacher",
        "Dance Instructor",
      ];
    },
    {
      name = "Event Services";
      subcategories = [
        "Event Planner",
        "Catering",
        "Photographer",
        "Decorator",
      ];
    },
    {
      name = "General Services";
      subcategories = [
        "Admin",
        "Helper",
        "Handyman",
        "Laborer",
        "Driver",
        "Housekeeper",
      ];
    },
    {
      name = "Construction";
      subcategories = [
        "Construction",
        "Builder",
        "Contractor",
        "Mason",
        "Laborer",
      ];
    },
    {
      name = "Healthcare & Wellness";
      subcategories = [
        "Nurse",
        "Healthcare Aide",
        "Physical Therapist",
        "Homeopathy",
      ];
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

  var subcategoryToCategoryMap : [(Text, Text)] = [
    ("Plumber", "Local Skilled Workers"),
    ("Electrician", "Local Skilled Workers"),
    ("Painter", "Local Skilled Workers"),
    ("Maid", "Local Skilled Workers"),
    ("Housekeeper", "Local Skilled Workers"),
    ("Barber", "Local Skilled Workers"),
    ("Beautician", "Local Skilled Workers"),
    ("Driver", "Local Skilled Workers"),
    ("Security", "Local Skilled Workers"),
    ("Daily Labours", "Local Skilled Workers"),
    ("Helper", "Local Skilled Workers"),
    ("Admin", "Local Skilled Workers"),
    ("Labour", "Local Skilled Workers"),
    ("General Labour", "Local Skilled Workers"),
    ("Admin Assistant", "Local Skilled Workers"),
    ("Household Helper", "Local Skilled Workers"),
  ];

  public func getAllCategories() : async [CategoryMapping] {
    let mappedCategories = categories.map(
      func(cat) {
        {
          category = cat.name;
          subcategories = cat.subcategories;
        };
      }
    );
    mappedCategories;
  };

  public func getCategoryBySubcategory(subcategory : Text) : async ?Text {
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
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  public type WorkerStatus = {
    #pendingVerification;
    #approved;
    #rejected : Text;
  };

  public type Worker = {
    id : Nat;
    userId : Principal;
    name : Text;
    phone : Text;
    category : Text;
    subcategory : Text;
    area : Text;
    experience : Text;
    workingHours : Text;
    photo : Storage.ExternalBlob;
    status : WorkerStatus;
    comments : ?Text;
    verified : Bool;
    featured : Bool;
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

  public shared ({ caller }) func submitWorkerRegistration(
    name : Text,
    phone : Text,
    category : Text,
    subcategory : Text,
    area : Text,
    experience : Text,
    workingHours : Text,
    photo : Storage.ExternalBlob,
    comments : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as workers");
    };

    let id = nextWorkerId;
    nextWorkerId += 1;

    let worker : Worker = {
      id;
      userId = caller;
      name;
      phone;
      category;
      subcategory;
      area;
      experience;
      workingHours;
      photo;
      status = #pendingVerification;
      comments;
      verified = false;
      featured = false;
    };

    workers.add(id, worker);
    "We will verify and publish";
  };

  public query func searchWorkersByArea(area : Text) : async [Worker] {
    workers.values().toArray().filter(
      func(w) { w.area.contains(#text(area)) and w.status == #approved }
    );
  };

  public query func getWorkersByCategory(category : Text) : async [Worker] {
    workers.values().toArray().filter(
      func(w) { w.category == category and w.status == #approved }
    );
  };

  public query func getWorkersBySubcategory(subcategory : Text) : async [Worker] {
    workers.values().toArray().filter(
      func(w) { w.subcategory == subcategory and w.status == #approved }
    );
  };

  public query func searchWorkersByAreaAndCategory(area : Text, category : Text) : async [Worker] {
    workers.values().toArray().filter(
      func(w) {
        w.area.contains(#text(area)) and w.category == category and w.status == #approved
      }
    );
  };

  public query func searchWorkersByAreaAndSubcategory(area : Text, subcategory : Text) : async [Worker] {
    workers.values().toArray().filter(
      func(w) {
        w.area.contains(#text(area)) and w.subcategory == subcategory and w.status == #approved
      }
    );
  };

  public shared ({ caller }) func createJobPost(
    workType : Text,
    area : Text,
    dateTime : Time.Time,
    salary : Text,
    description : Text,
    phone : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create job posts");
    };

    let id = nextJobId;
    nextJobId += 1;

    let job : JobPost = {
      id;
      workType;
      area;
      dateTime;
      salary;
      description;
      phone;
      status = #pending;
    };

    jobPosts.add(id, job);
    "Job post submitted for approval";
  };

  public query func getApprovedJobs() : async [JobPost] {
    jobPosts.values().toArray().filter(
      func(j) { j.status == #approved }
    );
  };

  public shared ({ caller }) func approveWorker(workerId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve workers");
    };

    let worker = switch (workers.get(workerId)) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) { w };
    };
    if (worker.status != #pendingVerification) {
      Runtime.trap("Worker not pending verification");
    };
    let updatedWorker = { worker with status = #approved; verified = true };
    workers.add(workerId, updatedWorker);
  };

  public shared ({ caller }) func rejectWorker(workerId : Nat, reason : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject workers");
    };

    let worker = switch (workers.get(workerId)) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) { w };
    };
    let updatedWorker = { worker with status = #rejected(reason) };
    workers.add(workerId, updatedWorker);
  };

  public shared ({ caller }) func approveJobPost(jobId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve job posts");
    };

    let job = switch (jobPosts.get(jobId)) {
      case (null) { Runtime.trap("Job post not found") };
      case (?j) { j };
    };
    if (job.status != #pending) {
      Runtime.trap("Job post not pending verification");
    };
    let updatedJob = { job with status = #approved };
    jobPosts.add(jobId, updatedJob);
  };

  public shared ({ caller }) func rejectJobPost(jobId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject job posts");
    };

    let job = switch (jobPosts.get(jobId)) {
      case (null) { Runtime.trap("Job post not found") };
      case (?j) { j };
    };
    let updatedJob = { job with status = #rejected };
    jobPosts.add(jobId, updatedJob);
  };

  public shared ({ caller }) func featureWorker(workerId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can feature workers");
    };

    let worker = switch (workers.get(workerId)) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) { w };
    };
    let updatedWorker = { worker with featured = true };
    workers.add(workerId, updatedWorker);
  };

  public shared ({ caller }) func unfeatureWorker(workerId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can unfeature workers");
    };

    let worker = switch (workers.get(workerId)) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) { w };
    };
    let updatedWorker = { worker with featured = false };
    workers.add(workerId, updatedWorker);
  };

  public shared ({ caller }) func markWorkerVerified(workerId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can mark workers as verified");
    };

    let worker = switch (workers.get(workerId)) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) { w };
    };
    let updatedWorker = { worker with verified = true };
    workers.add(workerId, updatedWorker);
  };

  public query func getFeaturedWorkers() : async [Worker] {
    workers.values().toArray().filter(
      func(w) { w.featured and w.status == #approved }
    );
  };

  public query func getWorkerById(id : Nat) : async ?Worker {
    workers.get(id);
  };

  public query func getJobPostById(id : Nat) : async ?JobPost {
    jobPosts.get(id);
  };

  public query ({ caller }) func getAllWorkers() : async [Worker] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all workers");
    };
    workers.values().toArray();
  };

  public query ({ caller }) func getAllJobPosts() : async [JobPost] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all job posts");
    };
    jobPosts.values().toArray();
  };

  public query ({ caller }) func getPendingWorkers() : async [Worker] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pending workers");
    };
    workers.values().toArray().filter(
      func(w) { w.status == #pendingVerification }
    );
  };

  public query ({ caller }) func getPendingJobPosts() : async [JobPost] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pending job posts");
    };
    jobPosts.values().toArray().filter(
      func(j) { j.status == #pending }
    );
  };

  public shared ({ caller }) func repairDataIntegrity() : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can repair data integrity");
    };

    let filteredWorkers = workers.filter(
      func(_, w) {
        w.name.size() > 0 and w.phone.size() > 0 and w.category.size() > 0 and w.area.size() > 0 and w.experience.size() > 0 and w.workingHours.size() > 0
      }
    );

    workers.clear();
    for ((k, v) in filteredWorkers.entries()) {
      workers.add(k, v);
    };

    let filteredJobs = jobPosts.filter(
      func(_, j) {
        j.workType.size() > 0 and j.area.size() > 0 and j.salary.size() > 0 and j.description.size() > 0 and j.phone.size() > 0
      }
    );

    jobPosts.clear();
    for ((k, v) in filteredJobs.entries()) {
      jobPosts.add(k, v);
    };

    "Data successfully repaired. Now " # workers.size().toText() # " workers and " # jobPosts.size().toText() # " valid job posts remain.";
  };

  public query func safeQueryWorker(id : Nat) : async ?Worker {
    let worker = workers.get(id);
    worker;
  };

  public query func getSafeCategoryWorkers(category : Text) : async [Worker] {
    let cat = if (category.size() == 0) { "General" } else { category };
    workers.values().toArray().filter(
      func(w) { w.category == cat and w.status == #approved }
    );
  };
};
