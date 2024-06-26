def simplify_patent_results(results):
    simplified_results = []
    for result in results:
        simplified_result = {
            "title": result.get('inventionTitle'),
            "abstract": result.get('abstractText', [None])[0],
            "claims": result.get('claimText', []),
            "description": result.get('descriptionText', [])
        }
        simplified_results.append(simplified_result)
    return simplified_results

def display_results(results):
    if results:
        for i, result in enumerate(results, 1):
            print(f"\nResult {i}:")
            print(f"Title: {result['title']}")
            print(f"Abstract: {result['abstract'][:200]}..." if result['abstract'] else "Abstract: N/A")
            print(f"Number of Claims: {len(result['claims'])}")
            print(f"Description length: {sum(len(d) for d in result['description'])} characters")
            print("-" * 80)
    else:
        print("No results found or error in data.")
