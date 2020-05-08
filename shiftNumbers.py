arr = [2,2,2,2]
def shiftBlock(arr):
    prevNum = -1;
    prevIndex = -1;
    for i in range(len(arr)-1,-1,-1):
        print(i)
        print(prevNum,prevIndex)
        if arr[i] != None and prevNum == -1:
            prevNum = arr[i]
            prevIndex = i
        elif arr[i] != None and prevNum > 0:
            if arr[i] == prevNum:
                arr[prevIndex] = None
                arr[i] *= 2
                prevNum = -1
            else:
                prevNum = arr[i]
                prevIndex = i
    for i in range(len(arr)-1,-1,-1):
        if arr[i] == None:
            j = i+1
            while j < len(arr) and arr[j] != None:
                arr[j-1] = arr[j]
                arr[j] = None
                j += 1
    return arr
print( shiftBlock(arr) )
