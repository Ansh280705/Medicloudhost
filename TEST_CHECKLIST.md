# PhonePe Integration - Test Checklist

## ✅ Pre-Testing Verification

- [x] PhonePe credentials configured in `.env`
- [x] Callback URL configured
- [x] Server actions created (`actions/phonepe.js`)
- [x] API callback route created (`app/api/payment/callback/route.js`)
- [x] Pricing component updated
- [x] Manual payment code removed
- [x] Development server running

## 🧪 Testing Steps

### 1. Basic Flow Test
- [ ] Navigate to `/pricing` page
- [ ] Verify wallet balance is displayed (if signed in)
- [ ] Click "Buy" button on any plan
- [ ] Verify loading dialog appears with spinner
- [ ] Verify redirect to PhonePe payment page
- [ ] Complete payment on PhonePe
- [ ] Verify redirect back to pricing page
- [ ] Verify success toast notification appears
- [ ] Verify credits are added to wallet
- [ ] Verify payment appears in "Recent Payment Activity"

### 2. Authentication Test
- [ ] Sign out
- [ ] Try to click "Buy" button
- [ ] Verify error toast: "Please sign in first"
- [ ] Sign in
- [ ] Verify can now purchase credits

### 3. Payment History Test
- [ ] Make a successful payment
- [ ] Scroll to "Recent Payment Activity" section
- [ ] Verify payment is listed
- [ ] Verify transaction ID is shown
- [ ] Verify status is "Approved" with green badge
- [ ] Verify timestamp is correct

### 4. Error Handling Test
- [ ] Test with invalid PhonePe credentials (temporarily)
- [ ] Verify error toast appears
- [ ] Verify loading state is cleared
- [ ] Verify user can try again

### 5. Mobile Responsiveness Test
- [ ] Open on mobile device or resize browser
- [ ] Verify pricing cards display in swiper
- [ ] Verify payment flow works on mobile
- [ ] Verify dialogs are mobile-friendly

### 6. Multiple Plans Test
- [ ] Test purchasing BASIC plan (₹300, 1 credit)
- [ ] Test purchasing STANDARD plan (₹600, 2 credits)
- [ ] Test purchasing PREMIUM plan (₹900, 3 credits)
- [ ] Verify correct amount is charged for each
- [ ] Verify correct credits are added for each

### 7. Payment Callback Test
- [ ] Complete a payment
- [ ] Check browser network tab for callback request
- [ ] Verify callback route is called
- [ ] Verify payment verification happens
- [ ] Verify database is updated

### 8. Database Verification
- [ ] Check `PaymentRequest` table after payment
- [ ] Verify record exists with correct:
  - [ ] Transaction ID
  - [ ] Amount
  - [ ] Credits
  - [ ] Payment method ("PhonePe")
  - [ ] Status ("APPROVED")
  - [ ] User ID
  - [ ] Timestamps

### 9. Credit Transaction Test
- [ ] After successful payment, check `CreditTransaction` table
- [ ] Verify transaction record created
- [ ] Verify correct credit amount
- [ ] Verify type is "CREDIT_PURCHASE"
- [ ] Verify linked to correct user

### 10. Edge Cases
- [ ] Test with slow internet connection
- [ ] Test closing browser during payment
- [ ] Test going back during payment
- [ ] Test multiple rapid clicks on "Buy" button
- [ ] Test with different browsers (Chrome, Firefox, Safari)

## 🔍 What to Look For

### Success Indicators:
✅ Loading dialog appears immediately
✅ Redirect to PhonePe happens within 2-3 seconds
✅ Payment page loads correctly
✅ After payment, redirected back to app
✅ Success toast notification shows
✅ Credits increase in wallet
✅ Payment appears in history
✅ No console errors

### Failure Indicators:
❌ Loading dialog doesn't appear
❌ No redirect to PhonePe
❌ Error messages in console
❌ Credits not added after payment
❌ Payment not in history
❌ User stuck on loading screen

## 🐛 Debugging

### If payment doesn't initiate:
1. Check browser console for errors
2. Check server logs in terminal
3. Verify PhonePe credentials in `.env`
4. Check `initiatePhonePePayment()` function logs

### If redirect doesn't work:
1. Verify `NEXT_PUBLIC_REDIRECT_URL` is correct
2. Check if callback route exists
3. Check PhonePe response in server logs
4. Verify OAuth token is obtained

### If credits aren't added:
1. Check if callback route was called
2. Check `verifyPhonePePayment()` logs
3. Verify payment status in database
4. Check for database transaction errors

## 📊 Test Results

### Test Date: _______________
### Tested By: _______________

| Test Case | Status | Notes |
|-----------|--------|-------|
| Basic Flow | ⬜ Pass / ⬜ Fail | |
| Authentication | ⬜ Pass / ⬜ Fail | |
| Payment History | ⬜ Pass / ⬜ Fail | |
| Error Handling | ⬜ Pass / ⬜ Fail | |
| Mobile Responsive | ⬜ Pass / ⬜ Fail | |
| Multiple Plans | ⬜ Pass / ⬜ Fail | |
| Payment Callback | ⬜ Pass / ⬜ Fail | |
| Database Verification | ⬜ Pass / ⬜ Fail | |
| Credit Transaction | ⬜ Pass / ⬜ Fail | |
| Edge Cases | ⬜ Pass / ⬜ Fail | |

## 📝 Notes

### Issues Found:
_________________________________
_________________________________
_________________________________

### Fixes Applied:
_________________________________
_________________________________
_________________________________

## ✅ Sign-off

- [ ] All tests passed
- [ ] No critical issues found
- [ ] Ready for production (after getting live credentials)

---

**Next Steps After Testing:**
1. Document any issues found
2. Fix any bugs discovered
3. Get production credentials from PhonePe
4. Update environment variables for production
5. Deploy to production
