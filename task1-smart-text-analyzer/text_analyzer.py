"""
Smart Text Analyzer

This module provides a function to analyze text and return:
- Total word count
- Average word length (2 decimals)
- Longest word(s) (all if tied)
- Word frequency (case-insensitive)
"""


def analyze_text(text):
    """
    Analyzes text and returns comprehensive statistics of the content of the text.
    
    Args:
        text (str): The input text to analyze
        
    Returns:
        dict: A dictionary containing:
            - word_count (int): Total number of words
            - average_word_length (float): Average word length rounded to 2 decimals
            - longest_words (list): List of all longest words (if tied, all are included)
            - word_frequency (dict): Dictionary with word frequencies (case-insensitive)
    
    Raises:
        TypeError: If input is not a string
        ValueError: If input is empty or contains no valid words
    """
    # Input validation
    if not isinstance(text, str):
        raise TypeError("Input must be a string")
    
    if not text or not text.strip():
        raise ValueError("Input text cannot be empty")
    
    # Split text into words, handling multiple spaces and punctuation
    # Using split() which handles whitespace, then cleaning punctuation
    words = text.split()
    
    # Clean words: remove punctuation and convert to lowercase for frequency
    cleaned_words = []
    for word in words:
        # Remove punctuation from start and end of words
        cleaned = word.strip('.,!?;:"()[]{}')
        if cleaned:  # Only add non-empty words after cleaning
            cleaned_words.append(cleaned.lower())
    
    if not cleaned_words:
        raise ValueError("Input text contains no valid words")
    
    # Calculate word count
    word_count = len(cleaned_words)
    
    # Calculate average word length
    total_length = sum(len(word) for word in cleaned_words)
    average_word_length = round(total_length / word_count, 2)
    
    # Find longest word(s)
    max_length = max(len(word) for word in cleaned_words)
    longest_words = [word for word in cleaned_words if len(word) == max_length]
    # Remove duplicates while preserving order
    longest_words = list(dict.fromkeys(longest_words))
    
    # Calculate word frequency (case-insensitive)
    word_frequency = {}
    for word in cleaned_words:
        word_frequency[word] = word_frequency.get(word, 0) + 1
    
    return {
        "word_count": word_count,
        "average_word_length": average_word_length,
        "longest_words": longest_words,
        "word_frequency": word_frequency
    }


if __name__ == "__main__":
    # Example usage
    example_text = "The quick brown fox jumps over the lazy dog the fox"
    result = analyze_text(example_text)
    
    print("Text Analyzer Results:")
    print("=" * 50)
    print(f"Input: {example_text}")
    print(f"\nWord Count: {result['word_count']}")
    print(f"Average Word Length: {result['average_word_length']}")
    print(f"Longest Words: {result['longest_words']}")
    print(f"\nWord Frequency:")
    for word, freq in sorted(result['word_frequency'].items()):
        print(f"  {word}: {freq}")

