"""
Test cases for the Smart Text Analyzer
"""

from text_analyzer import analyze_text


def test_example_case():
    """Test the example case from requirements"""
    text = "The quick brown fox jumps over the lazy dog the fox"
    result = analyze_text(text)
    
    print("Test 1: Example Case")
    print(f"Input: {text}")
    print(f"Result: {result}")
    print(f"Word Count: {result['word_count']}")
    print(f"Average Word Length: {result['average_word_length']}")
    print(f"Longest Words: {result['longest_words']}")
    print(f"Word Frequency: {result['word_frequency']}")
    print()


def test_single_word():
    """Test with a single word"""
    text = "hello"
    result = analyze_text(text)
    
    print("Test 2: Single Word")
    print(f"Input: {text}")
    print(f"Result: {result}")
    print()


def test_tied_longest_words():
    """Test with multiple words of same max length"""
    text = "cat dog bat"
    result = analyze_text(text)
    
    print("Test 3: Tied Longest Words")
    print(f"Input: {text}")
    print(f"Result: {result}")
    print(f"Longest Words: {result['longest_words']}")
    print()


def test_case_insensitive():
    """Test case-insensitive word frequency"""
    text = "Hello hello HELLO world World"
    result = analyze_text(text)
    
    print("Test 4: Case Insensitive")
    print(f"Input: {text}")
    print(f"Result: {result}")
    print(f"Word Frequency: {result['word_frequency']}")
    print()


def test_punctuation():
    """Test with punctuation"""
    text = "Hello, world! How are you?"
    result = analyze_text(text)
    
    print("Test 5: With Punctuation")
    print(f"Input: {text}")
    print(f"Result: {result}")
    print(f"Word Frequency: {result['word_frequency']}")
    print()


def test_error_cases():
    """Test error handling"""
    print("Test 6: Error Cases")
    
    # Test empty string
    try:
        analyze_text("")
        print("ERROR: Should have raised ValueError for empty string")
    except ValueError as e:
        print(f"✓ Correctly raised ValueError for empty string: {e}")
    
    # Test None (will raise TypeError)
    try:
        analyze_text(None)
        print("ERROR: Should have raised TypeError for None")
    except TypeError as e:
        print(f"✓ Correctly raised TypeError for None: {e}")
    
    # Test non-string
    try:
        analyze_text(123)
        print("ERROR: Should have raised TypeError for non-string")
    except TypeError as e:
        print(f"✓ Correctly raised TypeError for non-string: {e}")
    
    print()


if __name__ == "__main__":
    print("=" * 60)
    print("SMART TEXT ANALYZER - TEST SUITE")
    print("=" * 60)
    print()
    
    test_example_case()
    test_single_word()
    test_tied_longest_words()
    test_case_insensitive()
    test_punctuation()
    test_error_cases()
    
    print("=" * 60)
    print("All tests completed!")
    print("=" * 60)

