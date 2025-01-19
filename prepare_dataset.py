import pandas as pd
import numpy as np

def create_qa_pairs(row):
    conversations = []
    
    # Questions about drug side effects
    side_effects = [effect for effect in [row[f'sideEffect{i}'] for i in range(42)] if isinstance(effect, str) and effect.strip()]
    if side_effects:
        side_effects_str = ", ".join(side_effects)
        conversations.extend([
            {"from": "human", "value": f"What are the side effects of {row['name']}?"},
            {"from": "gpt", "value": f"The side effects of {row['name']} are: {side_effects_str}"}
        ])
    
    # Questions about drug uses
    uses = [use for use in [row[f'use{i}'] for i in range(5)] if isinstance(use, str) and use.strip()]
    if uses:
        uses_str = ", ".join(uses)
        conversations.extend([
            {"from": "human", "value": f"What are the uses of {row['name']}?"},
            {"from": "gpt", "value": f"{row['name']} is used for: {uses_str}"}
        ])
    
    # Questions about drug substitutes
    substitutes = [sub for sub in [row[f'substitute{i}'] for i in range(5)] if isinstance(sub, str) and sub.strip()]
    if substitutes:
        substitutes_str = ", ".join(substitutes)
        conversations.extend([
            {"from": "human", "value": f"What are the alternative medications for {row['name']}?"},
            {"from": "gpt", "value": f"The alternative medications for {row['name']} are: {substitutes_str}"}
        ])
    
    # General information about the drug
    conversations.extend([
        {"from": "human", "value": f"Can you provide general information about {row['name']}?"},
        {"from": "gpt", "value": f"{row['name']} belongs to the {row['Therapeutic Class']} class. " + \
                 (f"Mechanism of action: {row['Action Class']}. " if pd.notna(row['Action Class']) else "") + \
                 (f"Chemical class: {row['Chemical Class']}. " if pd.notna(row['Chemical Class']) else "") + \
                 (f"This medication is habit-forming." if row['Habit Forming'] == 'Yes' else "This medication is not habit-forming.")}
    ])
    
    return {"conversations": conversations}

# Load dataset
print("Loading dataset...")
dataset = pd.read_csv("medicine_dataset.csv", low_memory=False)
dataset = dataset.replace({np.nan: ""})  # Replace NaN values with empty string

# Process the entire dataset
print("Creating conversation pairs...")
all_conversations = []

for _, row in dataset.iterrows():
    conversation = create_qa_pairs(row)
    all_conversations.append(conversation)

# Convert to DataFrame and save as Parquet
df = pd.DataFrame(all_conversations)
df.to_parquet("med_dataset.parquet")

# Show example output
print("\nExample conversation:")
print(df.iloc[0]['conversations'])  # Show first drug's conversations

print(f"\nTotal {len(df)} drug conversations created and saved to med_dataset.parquet") 