#!/bin/bash

# RSVP Management CLI Script for Tulsi & Smarika Wedding
# Usage: ./rsvp-cli.sh [command] [email]

NAMESPACE_ID="36be1b6faa594f4ca8789a1000f1f493"

case "$1" in
    "list")
        echo "📋 Listing all RSVP keys..."
        wrangler kv key list --namespace-id="$NAMESPACE_ID" --prefix="rsvp:" | jq -r '.[] | select(.name | test("^rsvp:[^-]") and (test("rsvp-list") | not)) | .name'
        ;;

    "count")
        echo "📊 RSVP Statistics..."
        total=$(wrangler kv key list --namespace-id="$NAMESPACE_ID" --prefix="rsvp:" | jq -r '.[] | select(.name | test("^rsvp:[^-]") and (test("rsvp-list") | not)) | .name' | wc -l)
        echo "Total RSVPs: $total"
        ;;

    "view")
        if [ -z "$2" ]; then
            echo "❌ Please provide an email address"
            echo "Usage: ./rsvp-cli.sh view guest@example.com"
            exit 1
        fi
        echo "👤 Viewing RSVP for: $2"
        wrangler kv key get "rsvp:$2" --namespace-id="$NAMESPACE_ID" | jq .
        ;;

    "all")
        echo "📋 All RSVP Responses:"
        echo "===================="

        # Get all RSVP keys
        keys=$(wrangler kv key list --namespace-id="$NAMESPACE_ID" --prefix="rsvp:" | jq -r '.[] | select(.name | test("^rsvp:[^-]") and (test("rsvp-list") | not)) | .name')

        attending=0
        not_attending=0
        total_guests=0

        for key in $keys; do
            echo ""
            echo "Key: $key"
            rsvp_data=$(wrangler kv key get "$key" --namespace-id="$NAMESPACE_ID")
            echo "$rsvp_data" | jq .

            # Count statistics
            is_attending=$(echo "$rsvp_data" | jq -r '.attending')
            if [ "$is_attending" = "true" ]; then
                attending=$((attending + 1))
                guests=$(echo "$rsvp_data" | jq -r '.guests // 1')
                total_guests=$((total_guests + guests))
            else
                not_attending=$((not_attending + 1))
            fi

            echo "---"
        done

        echo ""
        echo "📊 Summary:"
        echo "Attending: $attending (Total guests: $total_guests)"
        echo "Not attending: $not_attending"
        echo "Total responses: $((attending + not_attending))"
        ;;

    "export")
        echo "📥 Exporting RSVPs to CSV..."
        echo "Name,Email,Attending,Guests,Meal Preference,Dietary Requirements,Message,Submitted At" > wedding-rsvps.csv

        keys=$(wrangler kv key list --namespace-id="$NAMESPACE_ID" --prefix="rsvp:" | jq -r '.[] | select(.name | test("^rsvp:[^-]") and (test("rsvp-list") | not)) | .name')

        for key in $keys; do
            rsvp_data=$(wrangler kv key get "$key" --namespace-id="$NAMESPACE_ID")

            name=$(echo "$rsvp_data" | jq -r '.name // ""' | sed 's/,/;/g')
            email=$(echo "$rsvp_data" | jq -r '.email // ""')
            attending=$(echo "$rsvp_data" | jq -r '.attending // false')
            guests=$(echo "$rsvp_data" | jq -r '.guests // ""')
            meal=$(echo "$rsvp_data" | jq -r '.mealPreference // ""' | sed 's/,/;/g')
            dietary=$(echo "$rsvp_data" | jq -r '.dietaryRequirements // ""' | sed 's/,/;/g')
            message=$(echo "$rsvp_data" | jq -r '.message // ""' | sed 's/,/;/g')
            submitted=$(echo "$rsvp_data" | jq -r '.submittedAt // ""')

            echo "\"$name\",\"$email\",\"$attending\",\"$guests\",\"$meal\",\"$dietary\",\"$message\",\"$submitted\"" >> wedding-rsvps.csv
        done

        echo "✅ Exported to wedding-rsvps.csv"
        ;;

    "help"|*)
        echo "🎉 Wedding RSVP CLI - Tulsi & Smarika"
        echo "======================================="
        echo ""
        echo "Commands:"
        echo "  list     - List all RSVP email addresses"
        echo "  count    - Show total number of RSVPs"
        echo "  view     - View specific RSVP by email"
        echo "  all      - Display all RSVPs with statistics"
        echo "  export   - Export all RSVPs to CSV file"
        echo "  help     - Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./rsvp-cli.sh list"
        echo "  ./rsvp-cli.sh view guest@example.com"
        echo "  ./rsvp-cli.sh all"
        echo "  ./rsvp-cli.sh export"
        ;;
esac