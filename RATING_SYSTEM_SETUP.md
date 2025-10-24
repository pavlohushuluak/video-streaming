# Rating System Setup Guide

## Overview
This guide explains how to set up and use the drama rating system that appears when users complete watching a drama.

## Features

### Rating Modal
- **Trigger**: Appears when user completes 90% or more of a drama
- **Rating Scale**: 0.0 to 5.0 stars
- **Professional UI**: Star-based interface with hover effects
- **Multi-language**: Supports Portuguese, English, and Spanish
- **Skip Option**: Users can skip rating if desired

### Database Structure
The rating system uses a `ratings` table with the following structure:
- `id`: UUID primary key
- `drama_id`: Text reference to drama
- `user_id`: UUID reference to user
- `rating`: Numeric value (0.0-5.0)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Setup Steps

### 1. Run Database Migration
Execute the SQL migration to create the ratings table:

```bash
# Apply the migration
supabase db push
```

Or run the SQL directly in Supabase SQL Editor:
```sql
-- See supabase/migrations/20250106000000-create-ratings-table.sql
```

### 2. Verify Components
The following components have been created/updated:

- ✅ `src/components/RatingModal.tsx` - Professional rating modal
- ✅ `src/pages/Player.tsx` - Integrated rating trigger
- ✅ Database migration for ratings table
- ✅ Automatic drama rating updates

### 3. Test the Rating System

1. **Start watching a drama**:
   - Navigate to any drama
   - Click "Watch Now"

2. **Complete the drama**:
   - Watch 90% or more of the video
   - OR click "End Watching" button

3. **Rate the drama**:
   - Rating modal will appear
   - Select 1-5 stars
   - Click "Submit Rating" or "Skip"

4. **Verify rating saved**:
   - Check the drama's rating on the drama list
   - Rating should be updated automatically

## How It Works

### Trigger Conditions
The rating modal appears when:
- User has watched 90% or more of the video duration
- User clicks "End Watching" button
- User has not already rated this drama in this session

### Rating Flow
1. **User completes drama** → Rating modal appears
2. **User selects rating** → 1-5 stars with hover effects
3. **User submits rating** → Saved to database
4. **Drama rating updated** → Average calculated automatically
5. **User redirected** → Back to home or drama list

### Database Operations
- **Save Rating**: Inserts new rating record
- **Calculate Average**: Automatically updates drama's average rating
- **Prevent Duplicates**: Users can only rate once per drama

## Features

### Professional UI
- ⭐ Star-based rating interface
- 🎨 Hover effects and animations
- 📱 Responsive design
- 🌍 Multi-language support
- ⚡ Real-time feedback

### Smart Triggers
- 📊 90% completion detection
- 🔄 Session-based tracking
- 🚫 Duplicate prevention
- ⏭️ Skip option available

### Automatic Updates
- 📈 Real-time average calculation
- 🔄 Automatic drama rating updates
- 📊 Database triggers for consistency

## Troubleshooting

### Common Issues

1. **Rating modal doesn't appear**:
   - Check if user has watched 90% of video
   - Verify drama duration is properly set
   - Check browser console for errors

2. **Rating not saved**:
   - Verify user is authenticated
   - Check database permissions
   - Review network requests

3. **Drama rating not updated**:
   - Check database triggers
   - Verify ratings table structure
   - Review average calculation logic

### Debug Steps

1. **Check browser console** for JavaScript errors
2. **Verify database migration** was applied successfully
3. **Test with different users** to isolate issues
4. **Check network tab** for failed API requests

## Customization

### Modify Trigger Percentage
To change when the rating modal appears, edit `src/pages/Player.tsx`:

```typescript
// Change from 90% to 80%
if (watchPercentage >= 80 && !hasShownRatingModal && drama) {
  setShowRatingModal(true);
  setHasShownRatingModal(true);
}
```

### Customize Rating Scale
To change the rating scale, edit `src/components/RatingModal.tsx`:

```typescript
// Change from 1-5 to 1-10
{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
  // ... star rendering logic
))}
```

### Add Rating Comments
To add comment functionality, extend the ratings table:

```sql
ALTER TABLE ratings ADD COLUMN comment TEXT;
```

## Next Steps

After setup:
1. Test with real users
2. Monitor rating patterns
3. Consider adding rating analytics
4. Implement rating-based recommendations 