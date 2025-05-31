// router.patch(
//   "/api/updateAccount",
//   checkTokenAuthen,
//   checkRoles([RoleName.GUEST, RoleName.STAFF_RECRUIT, RoleName.Recruit]),
//   upload.single("avatarIMG"),
//   updateUser
// );
// router.post(
//   "/api/createAccount",
//   checkSchema(accountRegisterValidator),
//   createUser
// );
// router.get(
//   "/api/appliedJobList/:userId",
//   checkTokenAuthen,
//   checkRoles([RoleName.GUEST]),
//   getAppliedJobList
// );

// router.post("/api/login", checkSchema(accountValidator), loginForUser);
// //! Login for Recruiter

// router.post(
//   "/api/RegisterRecruiter",
//   checkSchema(recruiterRegisValidator),
//   RegisterRecruiter
// );

// // !Get Profile for Recruiter
// router.get(
//   "/api/getProfileRecruiter",
//   checkTokenAuthen,
//   checkRoles([RoleName.STAFF_RECRUIT])
// );