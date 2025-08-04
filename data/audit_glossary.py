#!/usr/bin/env python3
"""
Audit script to compare the generated world_glossary.csv with the original varchiver tech_terms_queue.csv
"""

import csv
import sys
from pathlib import Path

def read_varchiver_csv(filepath):
    """Read the original varchiver tech terms queue CSV"""
    terms = {}

    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            term = row.get('term', '').strip()
            if term:
                terms[term] = {
                    'type': row.get('type', '').strip(),
                    'category': row.get('category', '').strip(),
                    'description': row.get('description', '').strip(),
                    'status': row.get('status', '').strip(),
                    'source': 'varchiver'
                }

    return terms

def read_world_glossary_csv(filepath):
    """Read the generated world glossary CSV"""
    terms = {}

    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            term = row.get('term', '').strip()
            if term:
                terms[term] = {
                    'type': row.get('type', '').strip(),
                    'category': row.get('category', '').strip(),
                    'description': row.get('description', '').strip(),
                    'status': row.get('status', '').strip(),
                    'source': row.get('source', '').strip(),
                    'related_terms': row.get('related_terms', '').strip(),
                    'etymology_notes': row.get('etymology_notes', '').strip()
                }

    return terms

def compare_terms(varchiver_terms, world_terms):
    """Compare the two term dictionaries"""

    varchiver_set = set(varchiver_terms.keys())
    world_set = set(world_terms.keys())

    # Find differences
    only_in_varchiver = varchiver_set - world_set
    only_in_world = world_set - varchiver_set
    in_both = varchiver_set & world_set

    # Check for changes in shared terms
    changed_terms = {}
    for term in in_both:
        v_term = varchiver_terms[term]
        w_term = world_terms[term]

        changes = {}
        for field in ['type', 'category', 'description', 'status']:
            if v_term.get(field, '') != w_term.get(field, ''):
                changes[field] = {
                    'original': v_term.get(field, ''),
                    'new': w_term.get(field, '')
                }

        if changes:
            changed_terms[term] = changes

    return {
        'only_in_varchiver': only_in_varchiver,
        'only_in_world': only_in_world,
        'changed_terms': changed_terms,
        'total_varchiver': len(varchiver_set),
        'total_world': len(world_set)
    }

def print_audit_report(comparison):
    """Print a detailed audit report"""

    print("=" * 80)
    print("GLOSSARY AUDIT REPORT")
    print("=" * 80)
    print()

    print(f"📊 SUMMARY:")
    print(f"   Original varchiver terms: {comparison['total_varchiver']}")
    print(f"   Generated world terms: {comparison['total_world']}")
    print(f"   Missing from world glossary: {len(comparison['only_in_varchiver'])}")
    print(f"   Added to world glossary: {len(comparison['only_in_world'])}")
    print(f"   Modified terms: {len(comparison['changed_terms'])}")
    print()

    if comparison['only_in_varchiver']:
        print("❌ MISSING FROM WORLD GLOSSARY:")
        print("   These terms were in varchiver but not included:")
        for term in sorted(comparison['only_in_varchiver']):
            print(f"   - {term}")
        print()

    if comparison['only_in_world']:
        print("✨ ADDED TO WORLD GLOSSARY:")
        print("   These terms were added (not in original varchiver):")
        world_only_by_source = {}
        for term in sorted(comparison['only_in_world']):
            # We'd need to check the source, but let's just list them
            print(f"   - {term}")
        print()

    if comparison['changed_terms']:
        print("🔄 MODIFIED TERMS:")
        print("   These terms had changes from the original:")
        for term, changes in comparison['changed_terms'].items():
            print(f"   - {term}:")
            for field, change in changes.items():
                print(f"     {field}: '{change['original']}' → '{change['new']}'")
        print()

    print("=" * 80)

def generate_sync_commands(comparison, varchiver_terms):
    """Generate commands to sync missing terms"""

    if comparison['only_in_varchiver']:
        print("🔧 SYNC COMMANDS:")
        print("   Add these lines to world_glossary.csv:")
        print()

        for term in sorted(comparison['only_in_varchiver']):
            v_term = varchiver_terms[term]
            # Create CSV line
            csv_line = f'"{term}","{v_term["type"]}","{v_term["category"]}","{v_term["description"]}","{v_term["status"]}","varchiver","",""'
            print(f"   {csv_line}")
        print()

def main():
    """Main audit function"""

    # File paths
    varchiver_path = Path("../varchiver/varchiver/inventory/data/tech_terms_queue.csv")
    world_path = Path("data/world_glossary.csv")

    # Check if files exist
    if not varchiver_path.exists():
        print(f"❌ ERROR: Cannot find varchiver file at {varchiver_path}")
        print("   Adjust the path in the script or run from correct directory")
        sys.exit(1)

    if not world_path.exists():
        print(f"❌ ERROR: Cannot find world glossary file at {world_path}")
        sys.exit(1)

    try:
        # Read both files
        print("📖 Reading files...")
        varchiver_terms = read_varchiver_csv(varchiver_path)
        world_terms = read_world_glossary_csv(world_path)

        # Compare
        print("🔍 Comparing terms...")
        comparison = compare_terms(varchiver_terms, world_terms)

        # Print report
        print_audit_report(comparison)

        # Generate sync commands
        generate_sync_commands(comparison, varchiver_terms)

    except Exception as e:
        print(f"❌ ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
