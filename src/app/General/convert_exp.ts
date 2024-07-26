import expTable from './rank_exp.json'; // Importing the JSON data

class ConvertExp {
    // Type the exp_table property
    private expTable: Record<number, number> = expTable;

    constructor() {
        // Constructor remains the same
    }

    levelToExp(level: number): number {
        let exp = 0;
        // Type the key in the loop
        for (const key in this.expTable) {
            // Ensure key is a number
            const numKey = parseInt(key, 10);
            if (numKey <= level) {
                exp += this.expTable[numKey];
            }
        }
        return exp;
    }

    expToLevel(exp: number): number {
        let exp_ = 0;
        // Type the key in the loop
        for (const key in this.expTable) {
            // Ensure key is a number
            const numKey = parseInt(key, 10);
            exp_ += this.expTable[numKey];
            if (exp_ > exp) {
                return numKey - 1;
            }
        }

        return exp === 16412378 ? 250 : exp_; // Simplified the last check
    }
}

export default ConvertExp; // Exporting the class
