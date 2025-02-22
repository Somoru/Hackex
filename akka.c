#include <stdio.h>
#include <stdlib.h>

#define MAX_SIZE 100
#define BUCKETS 10
#define MAX_BUCKET_SIZE 10


void displayArray(int array[], int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("%d", array[i]);
        if (i < size - 1) printf(", ");
    }
    printf("]\n");
}


void performInsertionSort(int array[], int size, int showPasses) {
    for (int i = 1; i < size; i++) {
        int current = array[i];
        int j = i - 1;
        while (j >= 0 && array[j] > current) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = current;

        if (showPasses) {
            printf("After pass %d: ", i);
            displayArray(array, size);
        }
    }
}


void performSelectionSort(int array[], int size, int showPasses) {
    for (int i = 0; i < size - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < size; j++) {
            if (array[j] < array[minIndex]) minIndex = j;
        }
        if (minIndex != i) {
            int temp = array[i];
            array[i] = array[minIndex];
            array[minIndex] = temp;
        }
        if (showPasses) {
            printf("After pass %d: ", i + 1);
            displayArray(array, size);
        }
    }
}


void performBubbleSort(int array[], int size, int showPasses) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                int temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
        if (showPasses) {
            printf("After pass %d: ", i + 1);
            displayArray(array, size);
        }
    }
}

int quickSortPartition(int array[], int start, int end, int showPasses, int totalSize) {
    int pivot = array[end];
    int partitionIndex = start - 1;

    for (int i = start; i < end; i++) {
        if (array[i] < pivot) {
            partitionIndex++;
            int temp = array[partitionIndex];
            array[partitionIndex] = array[i];
            array[i] = temp;
        }
    }

    int temp = array[partitionIndex + 1];
    array[partitionIndex + 1] = array[end];
    array[end] = temp;

    if (showPasses) displayArray(array, totalSize);

    return partitionIndex + 1;
}


void executeQuickSort(int array[], int start, int end, int showPasses, int totalSize) {
    if (start < end) {
        int pivotIndex = quickSortPartition(array, start, end, showPasses, totalSize);
        executeQuickSort(array, start, pivotIndex - 1, showPasses, totalSize);
        executeQuickSort(array, pivotIndex + 1, end, showPasses, totalSize);
    }
}


void performBucketSort(int array[], int size, int showPasses) {
    int buckets[BUCKETS][MAX_BUCKET_SIZE] = {0};
    int bucketElementCount[BUCKETS] = {0};

    int maximum = array[0];
    for (int i = 1; i < size; i++) if (array[i] > maximum) maximum = array[i];

    for (int i = 0; i < size; i++) {
        int bucketIndex = (array[i] * BUCKETS) / (maximum + 1);
        buckets[bucketIndex][bucketElementCount[bucketIndex]++] = array[i];
    }

    if (showPasses) {
        printf("Buckets after distribution:\n");
        for (int i = 0; i < BUCKETS; i++) {
            printf("Bucket %d: ", i);
            for (int j = 0; j < bucketElementCount[i]; j++) printf("%d ", buckets[i][j]);
            printf("\n");
        }
    }

    int index = 0;
    for (int i = 0; i < BUCKETS; i++) {
        performInsertionSort(buckets[i], bucketElementCount[i], 0);
        for (int j = 0; j < bucketElementCount[i]; j++) array[index++] = buckets[i][j];
    }

    if (showPasses) {
        printf("Buckets after sorting each bucket:\n");
        for (int i = 0; i < BUCKETS; i++) {
            printf("Bucket %d: ", i);
            for (int j = 0; j < bucketElementCount[i]; j++) printf("%d ", buckets[i][j]);
            printf("\n");
        }
    }
}

int main() {
    int array[MAX_SIZE], elementCount;
    int showSteps = 0;
    char choiceForSteps;

    printf("How many elements do you want to sort? ");
    scanf("%d", &elementCount);

    if (elementCount <= 0 || elementCount > MAX_SIZE) {
        printf("Error: Enter a valid number of elements (1-%d).\n", MAX_SIZE);
        return 1;
    }

    printf("Enter the elements separated by spaces: ");
    for (int i = 0; i < elementCount; i++) scanf("%d", &array[i]);

    printf("\nSorting Methods Available:\n");
    printf("1 - Insertion Sort\n2 - Selection Sort\n3 - Bubble Sort\n4 - Quick Sort\n5 - Bucket Sort\nYour choice: ");

    int methodChoice;
    scanf("%d", &methodChoice);

    if (methodChoice < 1 || methodChoice > 5) {
        printf("Invalid selection. Please restart and select a valid option.\n");
        return 1;
    }

    printf("Would you like to view intermediate steps? (y/n): ");
    scanf(" %c", &choiceForSteps);
    showSteps = (choiceForSteps == 'y' || choiceForSteps == 'Y') ? 1 : 0;

    printf("\nSorting in progress...\n");

    if (methodChoice == 1) performInsertionSort(array, elementCount, showSteps);
    else if (methodChoice == 2) performSelectionSort(array, elementCount, showSteps);
    else if (methodChoice == 3) performBubbleSort(array, elementCount, showSteps);
    else if (methodChoice == 4) executeQuickSort(array, 0, elementCount - 1, showSteps, elementCount);
    else performBucketSort(array, elementCount, showSteps);

    printf("\nSorted Array: ");
    displayArray(array, elementCount);

    return 0;
}
