# Assignment-1: MERN Stack

```
Names : Mitansh Kayathwal
Roll Nos: 2021101026
Branch : CSE
Course : Design and Analysis of Software Systems, Monsoon'22

OS:Linux
```

# **_Specification 1 : Login and Registration_**

Once the user signs up on the sign-up form, he is asked to login.

The sign-up and login buttons are disabled when invalid input i.e. empty input is present in any field.

The password has been encrypted in the backend using bcrypt.js library and then stored in mongodb. 

The buttons turn into a loader till the backend processes the query.

Once authenticated, a message is shown to a user and he is taken to the Dashboard page.

JWT token has been used to carry authorization and protection of backend routes everywhere along with keeping the user logged in on computer restart or closing of tab.

React's Protected Routes have been used to protect the routes until a user logs in.

# **_Specification 2 : Navbar_**

A navbar has been created using MUI Icons as required.

# **_Specification 3 : Profile Page_**

The profile page contains a form in which certain fields can be edited. Fields like email-id, username and age cannot be edited.

Along with this, on the page a list of Followers and Following has been shown along with an option to remove them.

An option to chat has also been provided to the user.

To implement chat, I have used Mongodb where I store the chat messages in order. The chat is not live i.e. there is a certain delay in the chat. The delay has been kept at 3 seconds.
This has been done using the setInterval method.

# **_Specification 4 : My Sub Greddiits Page_**

A button to create a new SubGreddit has been given.

Input validation has been done before form submission by turning the Submit button red.

Option to upload `image` has been given and is required to create a subgreddiit.

The Submit button turns into a loader until the backend query is finished.

Subgreddiit names have been kept `unique` in the mongodb schema, therefore an error will be thrown if a user tries to create another subgreddiit with same name.

All required details of a subgreddiit have been shown here with an option to open the subgreddiit page for the moderator to get a personal view.

A delete button has also been provided which deleted the subgreddiits along with other details from the mongodb schema.

# **_Specification 5 : Sub Greddiit Page_**

The moderator gets a personal view of `stats, reports, members and joining requests` for the corresponding Subgreddiit.

A `mini-navbar` has been provided rather than making changes to the `main-navbar` to access `stats, reports, members and joining requests`

## Users:

On this page, a list of all users have been provided to the moderator.

Blocked users are highlighted with red color.

## Joining Requests Page:

On this page, a list of all Joining requests have been provided to the moderator.

The moderator has an option to either accept a user or to reject a user from his subgreddiit.

## Stats:

On this page, 4 graphs have been shown representing each of the required stats.

In No Of Member graph, the daily new members have been shown rather than showing the number of overall members in the sub-greddiit at that point of time.

In No of Reported Reports vs No of Deleted Reports, they have been kept as general i.e. a Report might have been created yesterday but deleted today and will be shown in today's data.

## Reported Page:

On this page, a list of all reports have been provided to the moderator.

A report only stays on this page till 10 days or till a given amount of time after which it is deleted from the schema.

# **_Specification 6 : Sub Greddiits Page_**

### Search Bar:

A search bar has been created and implemented using Fuzzy search from Fuse.js library of React.

### Filtering based on tags:

An option to filter on the basis of tags have been provided to the user, multiple tags can be entered.

### Sorting:

An option to sort has been given along with implementation of `Nested Sorting`.

### Ordering of SubGreddiits:

The subgreddiits have been ordered such that those subgreddiits in which a user is a member are shown first and the rest of the subgreddiits  are shown after these.

### Leave Button:

An option to leave the subgreddiit has been given in those subgreddiits in which a user is a member but not a moderator.

A moderator `cannot` leave his Subgreddiit.

### Join Button:

A user can request to join a Subgreddiit where he is not a member provided that he has never `left` the Subgreddiit earlier and neither has he been `blocked` in this Subgreddiit. 

### Subgreddiit Redirect:

Each Subgreddiit is a clickable div on the Dashboard Page. A user can only click it if he is a member of the Subgreddiit and he is navigated to the corresponding Subgreddiit page. 

## Subgreddiit Page:

This is a common page for both the moderator as well as the other members of the subgreddiit where they are shown the  basic details on the left along with the subgreddiit profile image.

### Create Post Button:

A member can create a `post` in the subgreddit in which he is a member.

### Posts:

A member has an option to comment on a post.

`Nested Comments` have been implemented

A user has an option to up-vote or down-vote a particular post.

A user also has an option to save a post which would then be shown on the Saved Posts page of the user.

A `Follow` button has also been given for a post. On clicking again the corresponding user also gets `unfollowed`.

### Banned Keywords:

Any banned keyword present in a post is replaced with corresponding no of * as is the no of letters in the banned keyword.

# **_Specification 7 : Saved Posts Page_**

Here all the saved posts have been shown which have been saved by the user.

All banned keywords are shown using *.

An option to unsave a post has been provided to the user.

# **_Miscellaneous Details_**

## I/O Validation:

I/O Validation has been done in every form in bothe front-end as well as back-end.

The back-end throws an error when a user enters an invalid type of input.

## Unauthorized Access:

Unauthorized Access has been prevented to a user on direct-api call.

All back-end routes have been protected.

## Button disabling:

The buttons are disabled when a form is submitted and turned into a loader till the finish of the backend request.

New URLs have been created wherever asked to.

# **_Bonus_**

1) Chat

2) Multi-Level Comments

3) Fuzzy Search

4) Nested Search

5) Stats using graphs

6) Image Uploading
