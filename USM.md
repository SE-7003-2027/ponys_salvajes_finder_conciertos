# User Story Map - Concert Finder

## User Journey

```
[ Log In / Sign Up ] ➔ [ Recommendations (Home) ] ➔ [ Search / Filters ] ➔ [ Artist Profile ] ➔ [ Concert / Ticketing / Reviews ]
```

---

## User Story Mapping by Sprints

| Activity | Registration / Account | Recommendations (Home) | Search / Filters | Artist Profile | Concerts / Ticketing / Reviews |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sprint 1: Functional Skeleton** | Basic sign-up with email and password. | Static feed with general events (mocks). | Simple search by exact artist name. | Basic artist view: name, biography, and dates (mock). | Basic information: venue, date, and external link (mock). |
| **Sprint 2: Real Events** | User session persistence and authentication tokens. | Feed of real events fetched from an external API. | Search by artist or event connected to events API. | Rendering real artist data and current events. | Detailed concert view: venue, map/address, prices, and ticketing link. |
| **Sprint 3: Music Service Integration** | Spotify OAuth integration ("Connect Spotify account"). | Recommendation v1: Concerts based on user's Top Artists. | Search with basic autocomplete and partial matching. | Link to artist's Spotify profile and discography preview integration. | Button to save concert to wishlist. |
| **Sprint 4: Filters and "Similar Artists"** | Manual music preference management. | Recommendation v2: Concerts by similar artists (similar genre / related artists). | Advanced filters: by city/location, date range, and music genres. | Related artists tab with upcoming concerts. | (History) Creation of saved event lists (upcoming, past). |
| **Sprint 5: Reviews** | Editable user profile (avatar, biography, city, ...). | Personalized section: "Saved concerts". | Search suggestions based on tastes ("You might like"). | Average user rating for the artist's past concerts. | Reviews section: text and star rating (1 to 5) for past concerts. |
| **Sprint 6: Security, Non-Essential Features** | Login security, "forgot my password", ... | External error handling: third-party API failures, no available concerts, cancellations. | Optimization: pagination / infinite scroll in results. | Visual polish, responsive design. | Display reviews prioritizing user "Helpful" votes ("top" reviews first). |
